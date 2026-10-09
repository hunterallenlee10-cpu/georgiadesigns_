"use client";

import { useId, useState, type FormEvent } from "react";
import { EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { mailtoHref } from "@/lib/order";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  required?: boolean;
  hint?: string;
  options?: string[];
  autoComplete?: string;
  /** span both columns on wide screens */
  wide?: boolean;
}

interface Props {
  kind: "wholesale" | "contact";
  fields: FieldDef[];
  /** email subject; {field} is replaced with that field's value */
  subject: string;
  /** used for {field} values that were left empty */
  subjectFallback?: string;
  emailEnabled: boolean;
  submitLabel: string;
}

/**
 * A form that works with no backend: it opens an email with everything filled
 * in. If Resend is configured it sends straight from the site instead.
 */
export function InquiryForm({ kind, fields, subject, subjectFallback = "the website", emailEnabled, submitLabel }: Props) {
  const uid = useId();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");

  const id = (n: string) => `${uid}-${n}`;

  const subjectLine = () => subject.replace(/\{(\w+)\}/g, (_, k: string) => values[k]?.trim() || subjectFallback);

  const body = () =>
    fields
      .filter((f) => values[f.name]?.trim())
      .map((f) => `${f.label}: ${values[f.name].trim()}`)
      .join("\n");

  function validate() {
    const e: Record<string, string> = {};
    for (const f of fields) {
      const v = values[f.name]?.trim() ?? "";
      if (f.required && !v) e[f.name] = `please add ${f.label.toLowerCase()}`;
      else if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) e[f.name] = "that email doesn't look right";
    }
    setErrors(e);
    const first = fields.find((f) => e[f.name]);
    if (first) document.getElementById(id(first.name))?.focus();
    return !first;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    if (!emailEnabled) {
      window.location.href = mailtoHref(subjectLine(), body());
      setStatus("mailto");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          name: values.name || values.contact || values.business || "",
          contact: values.email || "",
          subject: subjectLine(),
          text: body(),
          company: values.company_website_hp ?? "",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-paper p-8 text-center" role="status">
        <p className="font-serif text-4xl">thank you!</p>
        <p className="mt-2 text-ink-soft">Georgia got your message and will be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const err = errors[f.name];
        const common = {
          id: id(f.name),
          name: f.name,
          value: values[f.name],
          autoComplete: f.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id(f.name)}-error` : f.hint ? `${id(f.name)}-hint` : undefined,
          required: f.required,
          onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [f.name]: e.target.value })),
          className: "field",
        };
        return (
          <div key={f.name} className={`grid content-start gap-1.5 ${f.wide || f.type === "textarea" ? "sm:col-span-2" : ""}`}>
            <label htmlFor={id(f.name)} className="text-sm font-medium">
              {f.label} {!f.required && <span className="font-normal text-ink-soft">(optional)</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} className="field min-h-32" maxLength={2000} />
            ) : f.type === "select" ? (
              <select {...common}>
                <option value="">choose one</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input {...common} type={f.type ?? "text"} maxLength={200} />
            )}
            {f.hint && !err && (
              <p id={`${id(f.name)}-hint`} className="text-sm text-ink-soft">
                {f.hint}
              </p>
            )}
            {err && (
              <p id={`${id(f.name)}-error`} className="text-sm text-[#a8343f]">
                {err}
              </p>
            )}
          </div>
        );
      })}
      {/* honeypot for bots; hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("hp")}>company website</label>
        <input
          id={id("hp")}
          tabIndex={-1}
          autoComplete="off"
          value={values.company_website_hp ?? ""}
          onChange={(e) => setValues((v) => ({ ...v, company_website_hp: e.target.value }))}
        />
      </div>
      <div className="sm:col-span-2">
        {status === "error" && (
          <p role="alert" className="mb-3 text-sm text-[#a8343f]">
            That didn&apos;t go through. Try again, or DM @georgiadesigns_ on Instagram.
          </p>
        )}
        {status === "mailto" && (
          <p role="status" className="mb-3 text-sm text-ink-soft">
            Your email app should open with everything filled in. Hit send there.
          </p>
        )}
        <Button type="submit" disabled={status === "sending"}>
          {emailEnabled ? <PaperPlaneTilt size={18} /> : <EnvelopeSimple size={18} />}
          {status === "sending" ? "sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
