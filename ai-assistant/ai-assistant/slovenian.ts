/**
 * Slovenian system prompt prepended to every conversation.
 */
export const SLOVENIAN_SYSTEM_PROMPT =
  'Si MotoChat, AI asistent za balkanske motoriste. Odgovarjaj v slovenščini, kratko in jasno. Pri vsakem odgovoru predlagaj naslednji korak.';

const ENGLISH_TO_SLOVENIAN: Array<[RegExp, string]> = [
  [/\bI'?m\s+sorry\b/gi, 'Žal mi je'],
  [/\bsorry\b/gi, 'oprostite'],
  [/\bplease\b/gi, 'prosim'],
  [/\bthank you\b/gi, 'hvala'],
  [/\bthanks\b/gi, 'hvala'],
  [/\byou'?re welcome\b/gi, 'ni za kaj'],
  [/\bhello\b/gi, 'pozdravljeni'],
  [/\bhi\b/gi, 'pozdravljeni'],
  [/\bhere\s+(?:is|are)\b/gi, 'tukaj je'],
  [/\bnext step\b/gi, 'naslednji korak'],
  [/\btoday\b/gi, 'danes'],
  [/\btomorrow\b/gi, 'jutri'],
  [/\bweather\b/gi, 'vreme'],
  [/\bfuel\b/gi, 'gorivo'],
  [/\broad\b/gi, 'cesta'],
  [/\bpass\b/gi, 'prelaz'],
  [/\bmotorcycle\b/gi, 'motocikel'],
  [/\bmotorbike\b/gi, 'motor'],
];

/**
 * heuristic check — true when the text contains characteristic Slovenian
 * diacritics or common words.
 */
function looksSlovenian(text: string): boolean {
  if (/[čšžČŠŽ]/.test(text)) return true;
  return /\b(?:in|je|ne|na|za|prosim|hvala|pot|prelaz|gorivo|vreme|danes|jutri)\b/i.test(
    text
  );
}

/**
 * normalise a reply so it always ends up in Slovenian. Performs a
 * lightweight pass-through translation of common English phrases when the
 * upstream provider replies in English.
 */
export function ensureSlovenian(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (looksSlovenian(trimmed)) return trimmed;

  let translated = trimmed;
  for (const [pattern, replacement] of ENGLISH_TO_SLOVENIAN) {
    translated = translated.replace(pattern, replacement);
  }
  return translated;
}
