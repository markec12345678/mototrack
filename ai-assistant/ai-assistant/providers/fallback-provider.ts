import type { AiProvider, AiProviderMessage } from '../ai-provider.js';

type HeuristicRule = {
  match: RegExp;
  reply: string;
};

const HEURISTIC_RULES: HeuristicRule[] = [
  {
    match: /vrši[čc]/i,
    reply:
      'Vršič je 1611 m visok alpski prelaz s 50 ovinki. Najboljši čas za vožnjo je od junija do septembra zgodaj zjutraj, ko je promet redkejši. **Pred odhodom preveri vreme** — nevihte se pogosto pojavijo popoldne.\n\n• Vzemi vetrno jakno in rezervne rokavice.\n• Dolijem polno gorivo v Kranjski Gori.\n• Naslednji korak: preveri trenutno stanje ceste na promet.si.',
  },
  {
    match: /so[čc]/i,
    reply:
      'Soška dolina je čudovita za vijugavo vožnjo med Bovcem in Kobaridom. Cesta je v dobrem stanju, razgledi nad smaragdno reko so vrhunski.\n\n• Postanek pri slapu Boka in tolmunih Velika korita.\n• Polno gorivo v Tolminu ali Bovcu.\n• Naslednji korak: rezerviraj kavo v Kobaridu in nadaljuj proti prelazu Predel.',
  },
  {
    match: /vreme/i,
    reply:
      'Trenutno nimam dostopa do vremenske napovedi v živo. Preveri ARSO ali meteo.si za zanesljivo napoved po regijah.\n\n• Pred vožnjo preveri padavine za naslednjih 6 ur.\n• Pripravi nepremočljiva oblačila.\n• Naslednji korak: vprašaj me za predloge poti glede na vremenske razmere.',
  },
  {
    match: /gorivo/i,
    reply:
      'Za daljše ture priporočam, da gorivo doliješ vsakih 200 km. Na odročnih prelazih (Mangart, Vršič, Predel) ni bencinskih črpalk.\n\n• Pred Vršičem napolni v Kranjski Gori ali Bovcu.\n• Vzemi rezervno 1 L plastenko, če greš na Mangart.\n• Naslednji korak: označim ti zadnje črpalke pred prelazom, ki te zanima.',
  },
  {
    match: /checklist|seznam|preveri/i,
    reply:
      'Hitri seznam pred vožnjo:\n\n• **Motor:** olje, hladilna tekočina, verižnik, pritisk gum.\n• **Oprema:** čelada, rokavice, dež jakna, prva pomoč.\n• **Dokumenti:** vozniško, prometno, zavarovalna.\n• **Telefon:** offline zemljevidi, polna baterija, powerbank.\n\nNaslednji korak: povej mi destinacijo, da seznam prilagodim za pot.',
  },
];

const DEFAULT_REPLY =
  'Trenutno delujem v offline načinu (brez API ključa). Vseeno ti lahko pomagam s splošnimi nasveti za balkanske ture.\n\n• Vprašaj me o Vršiču, Soški dolini, vremenu ali gorivu.\n• Lahko ti pripravim seznam pred vožnjo.\n\nNaslednji korak: zastavi konkretno vprašanje o poti ali pripravi.';

/**
 * Rule-based responder used when no AI provider API key is configured.
 * Handles Slovenian heuristics for the most common motorist scenarios so
 * the platform always returns something useful out of the box.
 */
export function createFallbackProvider(): AiProvider {
  return {
    name: 'fallback',
    generate(messages: AiProviderMessage[]) {
      const lastUserMessage = [...messages]
        .reverse()
        .find((message) => message.role === 'user');
      const text = lastUserMessage?.content ?? '';

      const matched = HEURISTIC_RULES.find((rule) => rule.match.test(text));
      const reply = matched ? matched.reply : DEFAULT_REPLY;
      return Promise.resolve(reply);
    },
  };
}
