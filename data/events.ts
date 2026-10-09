// Markets & events. Add a new entry to the top of the list.
// Events with a `date` in the future show as "upcoming" automatically;
// `status: "tba"` events always show as upcoming with "date coming soon".
// Dates are local (America/New_York) and written YYYY-MM-DD.

export interface SiteEvent {
  id: string;
  name: string;
  status: "scheduled" | "tba";
  /** first day, YYYY-MM-DD */
  date?: string;
  /** last day for multi-day events */
  endDate?: string;
  /** display label for the date when it isn't a single day */
  dateLabel?: string;
  /** 24h local times, used for the calendar file */
  startTime?: string;
  endTime?: string;
  timeLabel?: string;
  venue: string;
  address?: string;
  city: string;
  description: string;
  host?: string;
  link?: { href: string; label: string };
}

const BAZAAR_ADDRESS = "1225 Chestnut Dr, High Point, NC 27262";

export const events: SiteEvent[] = [
  {
    id: "bazaar-2026",
    name: "Carolina Christmas Bazaar 2026",
    status: "tba", // [CONFIRM] date once the Wesley Women announce it
    venue: "Wesley Memorial United Methodist Church",
    address: BAZAAR_ADDRESS,
    city: "High Point, NC",
    description:
      "The yearly bazaar in High Point. Come find the georgia designs table for stacks, stocking stuffers and gifts.",
    host: "a project of the Wesley Women",
  },
  {
    id: "bazaar-2025",
    name: "Carolina Christmas Bazaar",
    status: "scheduled",
    date: "2025-11-15",
    startTime: "08:00",
    endTime: "15:00",
    timeLabel: "8am to 3pm",
    venue: "Wesley Memorial United Methodist Church",
    address: BAZAAR_ADDRESS,
    city: "High Point, NC",
    description:
      "75 vendors, free admission and parking, and proceeds benefit local missions. The georgia designs table was full of stacks.",
    host: "a project of the Wesley Women",
  },
  {
    id: "bazaar-2024",
    name: "Carolina Christmas Bazaar",
    status: "scheduled",
    date: "2024-11-16",
    venue: "Wesley Memorial United Methodist Church",
    address: BAZAAR_ADDRESS,
    city: "High Point, NC",
    description: "Another year at the bazaar with the gold & pearl stacks.",
    host: "a project of the Wesley Women",
  },
  {
    id: "jewels-of-hope-2024",
    name: "Jewels of Hope",
    status: "scheduled",
    date: "2024-04-08",
    endDate: "2024-04-12",
    dateLabel: "Apr 8 to 12, 2024",
    venue: "UNC Chapel Hill",
    city: "Chapel Hill, NC",
    description:
      "A charity event with Carolina Women in Business featuring women-owned jewelry businesses. Proceeds went to the Orange County Rape Crisis Center. It was a huge success.",
    host: "Carolina Women in Business (@cwib_unc) & @jewelsofhope",
  },
];

/** Split into upcoming / past relative to `today` (YYYY-MM-DD). Pure, so it is testable. */
export function splitEvents(today: string, list: SiteEvent[] = events) {
  const upcoming: SiteEvent[] = [];
  const past: SiteEvent[] = [];
  for (const e of list) {
    const last = e.endDate ?? e.date;
    if (e.status === "tba" || (last && last >= today)) upcoming.push(e);
    else past.push(e);
  }
  upcoming.sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
  past.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return { upcoming, past };
}

export function formatEventDate(e: SiteEvent): string {
  if (e.status === "tba") return "date coming soon";
  if (e.dateLabel) return e.dateLabel;
  if (!e.date) return "";
  const d = new Date(`${e.date}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
