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
        const newsEntry = new NewsEntry();
        newsEntry.id = `reddit:${redditEntry.id}`;
        newsEntry.title = redditEntry.title;
        newsEntry.url = `https://reddit.com${redditEntry.permalink}`;
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
        const newsEntry = new NewsEntry();
        newsEntry.id = internalIdentifier;
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
    return fetchSubredditEntries("popular");
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
