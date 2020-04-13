import * as LRU from "lru-cache";

import NewsEntry, { NewsEntryIdentifier } from "./NewsEntry";

export type NewsSourceIdentifier = string;

interface IRedditEntryData {
  title: string;
  permalink: string;
  id: string;
}

interface IHackerNewsEntryData {
  id: number;
  title: string;
  url: string;
}

interface INewsAPIEntryData {
  title: string;
  url: string;
  urlToImage: string;
}

const hashCode = (str: string) => {
  /* tslint:disable no-bitwise */
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  /* tslint:enable no-bitwise */
  return hash;
};

const fetchSubredditEntries = (subreddit: string): Promise<NewsEntry[]> => {
  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(res => {
      return res.json();
    })
    .then((json): IRedditEntryData[] => {
      return json.data.children.map(
        (child: { data: IRedditEntryData }) => child.data
      );
    })
    .then(entries => {
      return entries.map(redditEntry => {
        const newsEntry = new NewsEntry({
          id: `reddit:${redditEntry.id}`,
          title: redditEntry.title,
          url: `https://reddit.com${redditEntry.permalink}`,
        });
        return newsEntry;
      });
    });
};

const fetchHackerNewsEntries = (
  seenItems: LRU.Cache<NewsEntryIdentifier, boolean>
): Promise<NewsEntry[]> => {
  return fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
    .then(res => {
      return res.json();
    })
    .then((ids: number[]) => {
      const promises = ids.slice(0, 25).map(id => {
        const internalIdentifier = `hn:${id}`;
        const newsEntry = new NewsEntry({
          id: internalIdentifier,
          title: '',
          url: '',
        });
        if (seenItems.get(internalIdentifier)) {
          return newsEntry;
        }
        return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(res => {
            return res.json();
          })
          .then((data: IHackerNewsEntryData) => {
            newsEntry.title = data.title;
            newsEntry.url = `https://news.ycombinator.com/item?id=${data.id}`;
            return newsEntry;
          });
      });
      return Promise.all(promises);
    });
};

const fetchCNNEntries = () => {
  const apiKey = "fa2409bcab3247b280c8e32d5fcda6a0";
  return fetch(
    `https://newsapi.org/v2/top-headlines?sources=cnn&apiKey=${apiKey}`
  )
    .then(res => {
      return res.json();
    })
    .then((json): INewsAPIEntryData[] => {
      return json.articles.slice(0, 1) as INewsAPIEntryData[];
    })
    .then(data => {
      return data.map(datum => {
        const newsEntry = new NewsEntry({
          id: `cnn:${hashCode(datum.url)}`,
          title: datum.title,
          url: datum.url,
        });
        return newsEntry;
      });
    });
};

export default class NewsSource {
  public static fetchEntries(
    source: NewsSource,
    seenItems: LRU.Cache<NewsEntryIdentifier, boolean>
  ) {
    if (source.identifier.startsWith("reddit:")) {
      return fetchSubredditEntries(source.identifier.split("reddit:")[1]);
    }
    if (source.identifier === "hackernews") {
      return fetchHackerNewsEntries(seenItems);
    }
    if (source.identifier === "cnn") {
      return fetchCNNEntries();
    }
    return Promise.resolve([]);
  }

  public readonly identifier: NewsSourceIdentifier;
  public readonly isLoading: boolean;
  public readonly isLoaded: boolean;

  constructor(
    identifier: NewsSourceIdentifier,
    isLoading: boolean,
    isLoaded: boolean
  ) {
    this.isLoading = isLoading;
    this.identifier = identifier;
    this.isLoaded = isLoaded;
  }
}
