/**
 * The breeze arrives in gusts rather than blowing constantly: one every
 * BREEZE_PERIOD_MS, easing in and out over BREEZE_GUST_MS, still the rest of
 * the cycle.
 *
 * This lives apart from the canvas because the wind indicator needs the same
 * gust state in React. Both read performance.now() through these functions, so
 * the icon cannot drift out of step with the flowers.
 */
export const BREEZE_PERIOD_MS = 9000;
export const BREEZE_GUST_MS = 3600;
export const BREEZE_AMP = 1.7;

/** 0 when still, rising to 1 at the height of a gust. */
export function gustStrength(now: number): number {
  const phase = now % BREEZE_PERIOD_MS;
  if (phase > BREEZE_GUST_MS) return 0;
  return Math.sin((Math.PI * phase) / BREEZE_GUST_MS);
}

/** How far a flower leans right now, in pixels at the top of its stem. */
export function breezeAt(now: number, x: number, jitter: number): number {
  const envelope = gustStrength(now);
  if (envelope === 0) return 0;
  const phase = now % BREEZE_PERIOD_MS;
  // Subtracting x makes the gust travel across the garden rather than hit
  // every flower at once.
  const wave = Math.sin(phase / 190 - x * 0.035 + jitter);
  return BREEZE_AMP * envelope * wave;
}
