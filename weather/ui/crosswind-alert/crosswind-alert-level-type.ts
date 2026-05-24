/**
 * Crosswind severity level returned by useCrosswind.
 * - `none`      — crosswind below threshold, no alert shown
 * - `moderate`  — yellow banner, caution advised
 * - `strong`    — orange banner, reduce speed
 * - `dangerous` — full-screen red flash, stop immediately
 */
export type CrosswindLevel = 'none' | 'moderate' | 'strong' | 'dangerous';
