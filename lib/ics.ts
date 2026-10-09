import type { SiteEvent } from "@/data/events";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

function stamp(date: string, time?: string) {
  return `${date.replace(/-/g, "")}${time ? `T${time.replace(":", "")}00` : ""}`;
}

function nextDay(date: string) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** An .ics calendar file for an event with a date. Returns null for TBA events. */
export function eventIcs(e: SiteEvent, siteUrl: string): string | null {
  if (!e.date) return null;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//georgia designs//events//EN",
    "BEGIN:VEVENT",
    `UID:${e.id}@georgiadesigns`,
    `DTSTAMP:${stamp(e.date, "00:00")}Z`,
  ];
  if (e.startTime && e.endTime && !e.endDate) {
    lines.push(`DTSTART;TZID=America/New_York:${stamp(e.date, e.startTime)}`);
    lines.push(`DTEND;TZID=America/New_York:${stamp(e.date, e.endTime)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${stamp(e.date)}`);
    lines.push(`DTEND;VALUE=DATE:${stamp(nextDay(e.endDate ?? e.date))}`);
  }
  lines.push(`SUMMARY:${esc(`${e.name} (georgia designs)`)}`);
  lines.push(`LOCATION:${esc([e.venue, e.address ?? e.city].join(", "))}`);
  lines.push(`DESCRIPTION:${esc(`${e.description}\n${siteUrl}/events`)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

export function icsDataUri(ics: string) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export function mapsUrl(e: SiteEvent) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([e.venue, e.address ?? e.city].join(", "))}`;
}
