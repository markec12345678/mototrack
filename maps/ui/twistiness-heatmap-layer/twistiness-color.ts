/**
 * Converts a normalized straightness score [0, 1] to an RGB color string.
 *
 * - 0 → green  (very twisty)
 * - 0.5 → yellow (moderately twisty)
 * - 1 → red   (very straight)
 */
export function straightnessToColor(score: number): string {
  const t = Math.max(0, Math.min(1, score));

  if (t <= 0.5) {
    const f = t / 0.5;
    const r = Math.round(f * 255);
    return `rgb(${r},200,0)`;
  }

  const f = (t - 0.5) / 0.5;
  const g = Math.round((1 - f) * 200);
  return `rgb(255,${g},0)`;
}
