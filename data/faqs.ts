// FAQ + care copy. Answers marked confirm: true still need Georgia's sign-off
// and render a small "draft" tag in development builds only.

export interface Faq {
  q: string;
  a: string;
  confirm?: boolean;
}

export const faqs: Faq[] = [
  {
    q: "How do I order?",
    a: "Add bracelets to your stack and tap send order. You can send it to me as an Instagram DM or an email, and I'll reach out to confirm. You can also just DM @georgiadesigns_ or comment on a post.",
  },
  {
    q: "How do I pay?",
    a: "Venmo or PayPal. Once I confirm your order I'll send over the details.",
  },
  {
    q: "Do you ship?",
    a: "Yes! DM me for shipping. Shipping cost is added when I confirm your order.",
    confirm: true, // [CONFIRM WITH GEORGIA: shipping cost and timing]
  },
  {
    q: "Can I pick up locally?",
    a: "Yes. I can meet up in Chapel Hill or High Point. Choose local meetup when you send your order and we'll set a time.",
  },
  {
    q: "How do I find my size?",
    a: "Wrap a soft tape measure (or a strip of paper) around your wrist bone and add about half an inch for a comfy fit. Most people are a standard. Not sure? Pick custom and tell me your measurement.",
    confirm: true, // [CONFIRM WITH GEORGIA: size guide + fit allowance]
  },
  {
    q: "Can I do a custom stack?",
    a: "Of course. Use build your stack to mix finishes and bead sizes, or tell me what you have in mind in the order notes.",
  },
  {
    q: "Do you do wholesale?",
    a: "Yes! Boutiques can send an inquiry on the wholesale page or DM me. Pricing & minimums shared on request.",
  },
  {
    q: "Will they tarnish?",
    a: "They're made with plated gold beads, so they won't tarnish or turn. They can be exposed to water and sweat.",
  },
];

/** Georgia's own claims (from her posts). */
export const materialClaims = [
  { title: "14k gold-plated beads", body: "Plated gold beads, so they won't tarnish or turn." },
  { title: "water & sweat friendly", body: "They can be exposed to water and sweat. Wear them to the gym, the beach, the game." },
  { title: "stretch fit", body: "Each one is strung on stretch cord, so it rolls right on." },
  { title: "made by hand", body: "Every bracelet is strung by Georgia in Chapel Hill and High Point." },
];

/** General tips, framed as tips rather than guarantees. */
export const careTips = [
  { title: "roll, don't pull", body: "Roll bracelets over your hand instead of stretching them wide. The cord lasts longer." },
  { title: "store them flat", body: "Lay them flat or keep them in a pouch so the cord doesn't stay stretched." },
  { title: "skip harsh chemicals", body: "Take them off for cleaning products, pools with lots of chlorine, and perfume sprays when you can." },
  { title: "wipe & go", body: "A soft cloth brings back the shine on gold, silver and pearls." },
];
