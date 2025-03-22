export interface MangaAttributes {
  altTitles: any[];
  availableTranslatedLanguages: string[];
  contentRating: string;
  createdAt: string;
  isLocked: boolean;
  lastChapter: string;
  lastVolume: string;
  originalLanguage: string;
  publicationDemographic: string;
  state: string;
  status: string;
  tags: any[]; //! let them be
  updatedAt: string;
  version: number;
  year: number;
  title: { en: string };
  description?: { en?: string; ja?: string };
}

export interface MangaRelationships {
  id: string;
  type: string;
  attributes?: any;
}

export interface TMangadexMangaData {
  id: string;
  type: string;
  attributes: MangaAttributes;
  relationships: MangaRelationships[];
}

export interface MangaResponse {
  data: TMangadexMangaData[];
  limit: number;
  offset: number;
  response: string;
  result: string;
  total: number;
}

export interface MangaDetailResponse {
  data: TMangadexMangaData;
  status: string;
}

export interface ChapterData {
  id: string;
  type: string;
  attributes: {
    volume: string;
    chapter: string;
    title: string;
    translatedLanguage: string;
  };
}

export interface ChapterResponse {
  data: ChapterData[];
}

export type FilterMain = "latest" | "recent" | "recommend";
export type FilterStatus = "ongoing" | "completed" | "hiatus" | "cancelled";
export type FilterPublicationDemographic =
  | "shounen"
  | "shoujo"
  | "josei"
  | "seinen";

export interface FilterMangaPayload {
  ids?: string[];
  limit: number;
  offset: number;
  title?: string;
  year?: string;
  status?: FilterStatus[];
  contentRating?: string[];
  includes?: string[];
  publicationDemographic?: FilterPublicationDemographic[];
  order?: FilterOrders;
  hasAvailableChapters?: string;
}

export interface FilterMangaChapterPayload {
  limit: number;
  manga?: string;
  contentRating?: string[];
  includes?: string[];
  order?: FilterOrders;
  translatedLanguage?: string[];
  chapter?: string[];
  volume?: string[];
  includeEmptyPages?: string;
}

export interface FilterMangaDetailResponse {
  includes?: string[];
  contentRating?: string[];
}

export interface FilterMangaStatisticsResponse {
  manga: string[];
}

export interface FilterOrders {
  title?: string;
  year?: string;
  updatedAt?: string;
  createdAt?: string;
  rating?: string;
  relevance?: string;
  volume?: string;
  chapter?: string;
  followedCount?: string;
}

export interface TMangadexMangaChapterData {
  id: string;
  type: string;
  attributes: TMangadexChapterAttribute;
  relationships: MangaRelationships[];
}

export interface TMangadexChapterAttribute {
  volume: string;
  chapter: string;
  title: string;
  translatedLanguage: string;
  externalUrl: any;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
}

export interface MangadexBaseResponseData<T> {
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
  status: any;
  message?: any;
}
