import type { ReactNode } from "react";

/** Title block at the top of inner pages. */
export function PageHeader({
  title,
  intro,
  children,
  className = "",
}: {
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`container-site pb-10 pt-10 md:pb-14 md:pt-16 ${className}`}>
      <h1 className="display max-w-[18ch] text-[clamp(2.6rem,5.2vw,4.4rem)]">{title}</h1>
      {intro && <div className="lede mt-5">{intro}</div>}
      {children}
    </header>
  );
}
