import type { CSSProperties } from "react";
import { DEFAULT_SITE_THEME, type SiteTheme } from "./calendar";

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

export function getSiteThemeStyle(theme: SiteTheme): ThemeStyle {
  const backgroundImage = /^\/[a-zA-Z0-9._%\- ]+$/.test(theme.backgroundImage)
    ? theme.backgroundImage
    : DEFAULT_SITE_THEME.backgroundImage;
  return {
    "--ink": theme.text,
    "--green": theme.primary,
    "--green-dark": theme.primaryDark,
    "--green-soft": theme.primarySoft,
    "--cream": theme.background,
    "--paper": theme.surface,
    "--rose": theme.accent,
    "--gold": theme.gold,
    "--muted": theme.muted,
    "--line": theme.line,
    "--site-background-image": `url("${backgroundImage}")`,
  };
}
