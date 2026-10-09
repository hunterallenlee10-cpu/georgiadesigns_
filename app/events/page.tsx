import type { Metadata } from "next";
import { CalendarPlus, MapPin, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/ui/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { formatEventDate, splitEvents, type SiteEvent } from "@/data/events";
import { site } from "@/data/site";
import { getToday } from "@/lib/today";
import { eventIcs, icsDataUri, mapsUrl } from "@/lib/ics";

export const metadata: Metadata = {
  title: "Markets & events",
  description:
    "Find georgia designs in person: the Carolina Christmas Bazaar in High Point, NC, Jewels of Hope at UNC Chapel Hill, and more markets for handmade beaded bracelets.",
  alternates: { canonical: "/events" },
};

function eventLd(e: SiteEvent) {
  if (!e.date) return null;
  const start = e.startTime ? `${e.date}T${e.startTime}:00-05:00` : e.date;
  const end = e.endTime ? `${e.date}T${e.endTime}:00-05:00` : (e.endDate ?? e.date);
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: start,
    endDate: end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.venue,
      address: e.address ?? e.city,
    },
    description: e.description,
    organizer: { "@type": "Organization", name: e.host ?? site.legalName },
    performer: { "@type": "Organization", name: site.legalName },
  };
}

function DateBadge({ e, large = false }: { e: SiteEvent; large?: boolean }) {
  const size = large ? "size-24" : "size-20";
  return (
    <div className={`flex ${size} shrink-0 flex-col items-center justify-center rounded-full bg-oat text-center`}>
      {e.date ? (
        <>
          <span className="label text-ink-soft">
            {new Date(`${e.date}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className={`font-serif leading-none ${large ? "text-4xl" : "text-3xl"}`}>{Number(e.date.slice(8, 10))}</span>
          <span className="text-[0.7rem] text-ink-soft">{e.date.slice(0, 4)}</span>
        </>
      ) : (
        <span className="font-serif text-xl italic leading-none">tba</span>
      )}
    </div>
  );
}

export default async function EventsPage() {
  const today = await getToday();
  const { upcoming, past } = splitEvents(today);
  const ld = upcoming.map(eventLd).filter(Boolean) as Record<string, unknown>[];

  return (
    <>
      {ld.length > 0 && <JsonLd data={ld} />}
      <PageHeader
        title={
          <>
            Markets <span className="warm">& events</span>
          </>
        }
        intro="Come say hi, try on a stack, and shop in person. New dates go up here and on Instagram first."
      />

      <section className="container-site pb-16" aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="h3">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-paper p-8 sm:p-10">
            <p className="font-serif text-3xl">next market coming soon.</p>
            <p className="mt-2 text-ink-soft">follow @{site.instagram.handle} for dates.</p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium"
            >
              <InstagramLogo size={20} /> <span className="link-underline">@{site.instagram.handle}</span>
            </a>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5">
            {upcoming.map((e) => {
              const ics = eventIcs(e, site.url);
              return (
                <li
                  key={e.id}
                  className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-line bg-paper p-6 sm:flex-row sm:p-10"
                >
                  <DateBadge e={e} large />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-[2rem] leading-tight">{e.name}</h3>
                    <p className="mt-1 text-ink">
                      {formatEventDate(e)}
                      {e.timeLabel ? `, ${e.timeLabel}` : ""}
                    </p>
                    <p className="mt-2 flex items-start gap-1.5 text-ink-soft">
                      <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>
                        {e.venue}
                        <br />
                        {e.address ?? e.city}
                      </span>
                    </p>
                    <p className="mt-4 max-w-[60ch] text-ink-soft">{e.description}</p>
                    {e.host && <p className="mt-2 text-sm text-ink-soft">{e.host}</p>}
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                      {ics && (
                        <a
                          href={icsDataUri(ics)}
                          download={`${e.id}.ics`}
                          className="inline-flex min-h-11 items-center gap-2 font-medium"
                        >
                          <CalendarPlus size={20} /> <span className="link-underline">add to calendar</span>
                        </a>
                      )}
                      <a
                        href={mapsUrl(e)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 font-medium"
                      >
                        <MapPin size={20} /> <span className="link-underline">open in google maps</span>
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="border-t border-line bg-oat py-16 md:py-20" aria-labelledby="past-title">
        <div className="container-site">
          <h2 id="past-title" className="h3">
            Past markets
          </h2>
          <ul className="mt-6 grid gap-x-10 md:grid-cols-2">
            {past.map((e) => (
              <li key={e.id} className="flex gap-5 border-b border-line py-6">
                <DateBadge e={e} />
                <div>
                  <h3 className="font-medium">{e.name}</h3>
                  <p className="text-sm text-ink-soft">
                    {formatEventDate(e)} · {e.city}
                  </p>
                  <p className="mt-2 text-[0.95rem] text-ink-soft">{e.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
