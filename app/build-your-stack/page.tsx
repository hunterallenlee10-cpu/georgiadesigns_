import type { Metadata } from "next";
import { Suspense } from "react";
import { StackBuilder } from "@/components/builder/StackBuilder";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Build your stack",
  description:
    "Build your own gold bracelet stack: pick gold, silver, mixed metals or pearl in 4mm or 6mm, see it on the wrist, and get any 3 for $50. Handmade in Chapel Hill & High Point, NC.",
  alternates: { canonical: "/build-your-stack" },
};

export default function BuildYourStackPage() {
  return (
    <>
      <PageHeader
        title={
          <>
            Build <span className="warm">your stack</span>
          </>
        }
        intro="Pick three, watch them stack up, and the set is $50. Mix metals, mix sizes, make it yours."
        className="!pb-8 md:!pb-10"
      />
      <div className="container-site pb-24">
        <Suspense fallback={<div className="h-[640px] rounded-[var(--radius-card)] bg-oat" aria-hidden="true" />}>
          <StackBuilder />
        </Suspense>
      </div>
    </>
  );
}
