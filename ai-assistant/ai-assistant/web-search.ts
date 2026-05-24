export type WebSearchSnippet = {
  title: string;
  url: string;
  text: string;
};

export type WebSearchResult = {
  snippets: WebSearchSnippet[];
};

type DuckDuckGoTopic = {
  Text?: string;
  FirstURL?: string;
  Result?: string;
  Topics?: DuckDuckGoTopic[];
};

type DuckDuckGoResponse = {
  Heading?: string;
  AbstractText?: string;
  AbstractURL?: string;
  AbstractSource?: string;
  Answer?: string;
  AnswerType?: string;
  RelatedTopics?: DuckDuckGoTopic[];
  Results?: DuckDuckGoTopic[];
};

function topicToSnippet(topic: DuckDuckGoTopic): WebSearchSnippet | undefined {
  if (!topic?.FirstURL || !topic.Text) return undefined;
  const [title, ...rest] = topic.Text.split(' - ');
  return {
    title: title?.trim() || topic.Text,
    url: topic.FirstURL,
    text: rest.join(' - ').trim() || topic.Text,
  };
}

function flattenTopics(topics: DuckDuckGoTopic[] = []): WebSearchSnippet[] {
  const snippets: WebSearchSnippet[] = [];
  for (const topic of topics) {
    if (topic.Topics?.length) {
      snippets.push(...flattenTopics(topic.Topics));
    } else {
      const snippet = topicToSnippet(topic);
      if (snippet) snippets.push(snippet);
    }
  }
  return snippets;
}

/**
 * Perform a web search using DuckDuckGo Instant Answer API. No API key is
 * required. Returns a normalised list of snippets — empty when DuckDuckGo
 * has no instant answer for the query.
 */
export async function webSearch(query: string): Promise<WebSearchResult> {
  const trimmed = query.trim();
  if (!trimmed) return { snippets: [] };

  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(trimmed)}&format=json&no_redirect=1&no_html=1`;
  const response = await fetch(url);
  if (!response.ok) return { snippets: [] };

  const payload = (await response.json()) as DuckDuckGoResponse;
  const snippets: WebSearchSnippet[] = [];

  if (payload.AbstractText && payload.AbstractURL) {
    snippets.push({
      title: payload.Heading || payload.AbstractSource || trimmed,
      url: payload.AbstractURL,
      text: payload.AbstractText,
    });
  }

  if (payload.Answer && payload.AbstractURL) {
    snippets.push({
      title: payload.Heading || trimmed,
      url: payload.AbstractURL,
      text: payload.Answer,
    });
  }

  snippets.push(...flattenTopics(payload.RelatedTopics));
  snippets.push(...flattenTopics(payload.Results));

  const unique = new Map<string, WebSearchSnippet>();
  for (const snippet of snippets) {
    if (!unique.has(snippet.url)) unique.set(snippet.url, snippet);
  }

  return { snippets: Array.from(unique.values()).slice(0, 8) };
}
