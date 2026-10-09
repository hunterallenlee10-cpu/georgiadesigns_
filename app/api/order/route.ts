// Optional email delivery through Resend. It only turns on when RESEND_API_KEY
// is set; without it the site uses Instagram DMs and mailto links instead.
//
// Env vars:
//   RESEND_API_KEY   - from resend.com
//   ORDER_INBOX      - where orders go (falls back to NEXT_PUBLIC_CONTACT_EMAIL)
//   RESEND_FROM      - verified sender, e.g. "georgia designs <orders@yourdomain.com>"
//
// [HOOK] Payments: to take card payments later, create a Stripe Checkout
// session here (or swap the order drawer's "send" button for a Shopify Buy
// Button) instead of emailing the order.

const MAX_TEXT = 6000;
const KINDS = new Set(["order", "wholesale", "contact"]);

function clean(v: unknown, max = 300): string {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function send(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.ORDER_INBOX || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  if (!apiKey || !inbox) {
    return Response.json({ ok: false, error: "email sending is not configured" }, { status: 501 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  // bots fill the hidden field; pretend it worked
  if (clean(data.company)) return Response.json({ ok: true });

  const kind = clean(data.kind, 20);
  const text = clean(data.text, MAX_TEXT);
  const name = clean(data.name, 120);
  const contact = clean(data.contact, 200);
  if (!KINDS.has(kind) || !text) {
    return Response.json({ ok: false, error: "missing order details" }, { status: 400 });
  }

  const from = process.env.RESEND_FROM || "georgia designs <onboarding@resend.dev>";
  const subject =
    clean(data.subject, 160) ||
    (kind === "order" ? `new order from ${name || "the website"}` : `${kind} message from ${name || "the website"}`);

  try {
    await send(apiKey, {
      from,
      to: [inbox],
      subject,
      text,
      ...(isEmail(contact) ? { reply_to: contact } : {}),
    });
    // a copy for the customer on orders, when they gave an email
    if (kind === "order" && isEmail(contact)) {
      await send(apiKey, {
        from,
        to: [contact],
        subject: "your georgia designs order 🎀",
        text: `thank you!! georgia will reach out to confirm and send venmo / paypal details.\n\nhere's what you sent:\n\n${text}`,
      }).catch(() => {
        // the order itself went through; a failed copy shouldn't fail the request
      });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "could not send" }, { status: 502 });
  }
}
