import type { MetadataRoute } from "next";
import { readCalendar } from "./lib/calendar-store";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const calendar = await readCalendar();
  return {
    name: calendar.siteCopy.brand,
    short_name: calendar.siteCopy.adventTab,
    description: calendar.siteCopy.pwaDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: calendar.theme.background,
    theme_color: calendar.theme.primary,
    lang: "it",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
