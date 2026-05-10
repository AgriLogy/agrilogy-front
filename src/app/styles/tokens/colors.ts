/**
 * Brand and semantic color palette.
 * Single source of truth — consumed by tailwind.config.ts and antdTheme.ts.
 *
 * The 50–900 scale follows the Material/Tailwind convention so it maps
 * cleanly to both Tailwind utilities (`bg-primary-500`) and AntD tokens
 * (`colorPrimary` = primary[600]).
 *
 * Palette: "Agrilogy Forest" — a calibrated forest-green tuned for an
 * agriculture brand. The 600 step (brand primary) hits WCAG AA on white
 * (~6.0:1); the 400 step works as the brand primary in dark mode.
 */

export const primary = {
  50: '#eef9f1',
  100: '#d6f0dd',
  200: '#aee0bd',
  300: '#7ecb98',
  400: '#4cae70',
  500: '#2e924f',
  600: '#1f7740', // brand primary (light mode)
  700: '#175e33',
  800: '#114828',
  900: '#0c331c',
} as const;

export const neutral = {
  0: '#ffffff',
  50: '#f7f9f8',
  100: '#eef2f0',
  200: '#dde4e0',
  300: '#c1ccc6',
  400: '#8e9a94',
  500: '#647069',
  600: '#475149',
  700: '#323a34',
  800: '#1f2521',
  900: '#121613',
  1000: '#000000',
} as const;

export const semantic = {
  success: '#2e924f',
  warning: '#d97706',
  danger: '#dc2626',
  /* `info` was a teal blue (#0284c7). AntD derives every blue shade
   * (#0958d9, #003eb3, #001d66, etc.) from this token, which leaks
   * onto links, anchors, and tag-info backgrounds across the app.
   * Aligning it with the brand keeps the whole UI on one palette — the
   * "Nouvelle notification de zone" modal already used `colorPrimary`
   * (this same green) for every accent. */
  info: primary[600],
} as const;

export const surface = {
  page: neutral[50],
  card: neutral[0],
  inverse: neutral[900],
} as const;

export const text = {
  primary: neutral[900],
  secondary: neutral[600],
  muted: neutral[400],
  inverse: neutral[0],
} as const;

export const border = {
  subtle: neutral[200],
  default: neutral[300],
  strong: neutral[400],
} as const;

/**
 * Chart-series palette — used by every recharts series, "Dernière
 * valeur" icon, and tooltip. Five steps of the brand green plus the
 * semantic warning/danger so domain hues (water, temperature, NPK,
 * pluvio, etc.) still differentiate without leaking blues.
 *
 * Pick by intent:
 *   - main           : the primary series on a single-line chart
 *   - secondary      : a paired series (e.g. humidity vs temperature)
 *   - accent / dim   : highlight / muted
 *   - cool / warm    : two-tone gradients
 *   - warning/danger : threshold / hazard markers
 */
export const series = {
  main: primary[600], // #1f7740
  secondary: primary[400], // #4cae70
  accent: primary[300], // #7ecb98
  dim: primary[200], // #aee0bd
  deep: primary[800], // #114828
  light: primary[100], // #d6f0dd
  cool: primary[500], // #2e924f
  warm: semantic.warning, // #d97706
  danger: semantic.danger, // #dc2626
} as const;

export const colors = {
  primary,
  neutral,
  semantic,
  surface,
  text,
  border,
  series,
} as const;

export type ColorTokens = typeof colors;
