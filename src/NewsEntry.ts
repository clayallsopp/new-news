export type NewsEntryIdentifier = string;

export default class NewsEntry {
  public id: NewsEntryIdentifier;
  public title: string;
  public url: string;

  constructor(options: { url: string, title: string, id: NewsEntryIdentifier }) {
    this.url = options.url;
    this.title = options.title;
    this.id = options.id;
  }
}
