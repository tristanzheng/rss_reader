export interface Feed {
  id: string;
  userId: string;
  folderId: string | null;
  title: string;
  url: string;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  parentId: string | null;
}

export interface Entry {
  id: string;
  feedId: string;
  title: string;
  url: string;
  guid: string | null;
  content: string;
  fulltext: string | null;
  publishedAt: string;
}

export interface OpmlImportResult {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

export class InMemoryStore {
  public feeds: Feed[] = [];
  public folders: Folder[] = [];
  public entries: Entry[] = [];
  public reads = new Map<string, Set<string>>();
  public saves = new Map<string, Set<string>>();
  public fetchFailures = new Map<string, number>();

  public reset(): void {
    this.feeds = [];
    this.folders = [];
    this.entries = [];
    this.reads.clear();
    this.saves.clear();
    this.fetchFailures.clear();
  }
}

export const store = new InMemoryStore();
