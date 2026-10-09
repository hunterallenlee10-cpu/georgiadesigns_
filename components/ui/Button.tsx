import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "light" | "text";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-out-soft)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-[#3a352e] min-h-12 px-7 text-[0.95rem]",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-cream min-h-12 px-7 text-[0.95rem]",
  light: "bg-cream text-ink hover:bg-paper min-h-12 px-7 text-[0.95rem]",
  text: "link-underline min-h-11 px-0 text-[0.95rem] rounded-none",
};

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type LinkProps = { href: string; variant?: Variant; className?: string; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className"
>;

export function ButtonLink({ href, variant = "primary", className = "", children, ...rest }: LinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

type BtnProps = { variant?: Variant } & ComponentProps<"button">;

export function Button({ variant = "primary", className = "", type = "button", ...rest }: BtnProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}
