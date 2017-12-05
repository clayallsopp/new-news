import NewsEntry from './NewsEntry';

export type NewsSourceIdentifier = string;

interface RedditEntryData {
  title: string;
  permalink: string;
  id: string;
}

interface HackerNewsEntryData {
  id: number;
  title: string;
  url: string;
}

const fetchSubredditEntries = (subreddit: string): Promise<NewsEntry[]> => {
  return fetch(`https://www.reddit.com/r/${subreddit}.json`).then((res) => {
    return res.json();
  }).then((json): RedditEntryData[] => {
    return json.data.children.map((child: { data: RedditEntryData }) => child.data);
  }).then((entries) => {
    return entries.map((redditEntry) => {
      const newsEntry = new NewsEntry();
      newsEntry.id = `reddit:${redditEntry.id}`;
      newsEntry.title = redditEntry.title;
      newsEntry.url = `https://reddit.com${redditEntry.permalink}`;
      return newsEntry;
    });
  });
};

const fetchHackerNewsEntries = (): Promise<NewsEntry[]> => {
  return fetch('https://hacker-news.firebaseio.com/v0/topstories.json').then((res) => {
    return res.json();
  }).then((ids: number[]) => {
    const promises = ids.slice(0, 25).map((id) => {
      return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => {
        return res.json();
      }).then((data: HackerNewsEntryData) => {
        const newsEntry = new NewsEntry();
        newsEntry.id = `hn:${data.id}`;
        newsEntry.title = data.title;
        newsEntry.url = `https://news.ycombinator.com/item?id=${data.id}`;
        return newsEntry;
      });
    });
    return Promise.all(promises);
  });
};

export default class NewsSource {
  private _identifier: NewsSourceIdentifier;
  private _isLoading: boolean;
  private _isLoaded: boolean;

  public static fetchEntries(source: NewsSource) {
    if (source.identifier.startsWith('reddit:')) {
      return fetchSubredditEntries(source.identifier.split('reddit:')[1]);
    }
    if (source.identifier === 'hackernews') {
      return fetchHackerNewsEntries();
    }
    return fetchSubredditEntries('popular');
  }

  constructor(identifier: NewsSourceIdentifier, isLoading: boolean, isLoaded: boolean) {
    this._isLoading = isLoading;
    this._identifier = identifier;
    this._isLoaded = isLoaded;
  }
 
  get isLoading() {
    return this._isLoading;
  }

  get isLoaded() {
    return this._isLoaded;
  }

  get identifier() {
    return this._identifier;
  }
}