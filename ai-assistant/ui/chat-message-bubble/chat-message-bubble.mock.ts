import type { ChatCitation } from './citation-type.js';

export const mockUserMessage = {
  role: 'user' as const,
  content: `Predlagaj vijugasto pot po Soški dolini za vikend izlet z motorjem.`,
};

export const mockAssistantMessage = {
  role: 'assistant' as const,
  content: `Soška dolina je ena izmed **najlepših motorističnih destinacij** v Sloveniji. Tukaj je predlagana pot:

- Začnite v **Novi Gorici** in se odpravite proti Kanalu ob Soči
- Nadaljujte skozi slikovito **Tolmin** in se ustavite pri sotočju Soče in Tolminke
- Vzpnite se na **Kobariški muzej** za zgodovinski pogled na Prvo svetovno vojno
- Zaključite z vožnjo čez **Vršič** (1611 m) za nepozabne razglede

Skupna razdalja je približno **180 km**, idealna za enodnevni izlet. Priporočamo zgoden odhod, da se izognete gneči v poletnih mesecih.`,
  citations: [
    {
      title: `Soška dolina — Slovenija.info`,
      url: `https://www.slovenia.info/sl/kraji/soska-dolina`,
    },
    {
      title: `Vršič — Wikipedia`,
      url: `https://sl.wikipedia.org/wiki/Vr%C5%A1i%C4%8D`,
    },
    {
      title: `Kobariški muzej`,
      url: `https://www.kobariski-muzej.si`,
    },
  ] satisfies ChatCitation[],
};

export const mockAssistantSimple = {
  role: 'assistant' as const,
  content: `Jutri bo v **Bovcu** delno oblačno z možnostjo popoldanskih neviht. Temperatura bo med 18 °C in 26 °C. Za vožnjo priporočamo dopoldanske ure.`,
  citations: [
    {
      title: `ARSO — Napoved za Bovec`,
      url: `https://meteo.arso.gov.si`,
    },
  ] satisfies ChatCitation[],
};

export const mockAssistantNoCitations = {
  role: 'assistant' as const,
  content: `Pred vožnjo na Vršič preverite naslednje:

- **Dokumente**: vozniško dovoljenje, prometno dovoljenje, zavarovanje
- **Motor**: olje, zavore, luči, tlak v pnevmatikah
- **Oprema**: čelada, rokavice, jakna, škornji
- **Navigacija**: naložite offline karte za primere slabe signalne pokritosti`,
};
