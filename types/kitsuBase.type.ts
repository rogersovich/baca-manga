export interface TKitsuBaseResponse {
  data: TKitsuManga[];
  meta: TKitsuBaseResponseMeta;
  links: TKitsuBaseResponseLinks;
  status: any;
  message?: any;
}

export interface TKitsuManga {
  id: string;
  type: string;
  links: TKitsuMangaLinks;
  attributes: TKitsuMangaAttributes;
  relationships: any;
}

export interface TKitsuMangaAttributes {
  createdAt: any;
  updatedAt: any;
  slug: string;
  synopsis: string;
  description: string;
  coverImageTopOffset: number;
  titles: TKitsuMangaTitles;
  canonicalTitle: string;
  abbreviatedTitles: any[];
  averageRating: null;
  ratingFrequencies: { [key: string]: string };
  userCount: number;
  favoritesCount: number;
  startDate: any;
  endDate: any;
  nextRelease: null;
  popularityRank: number;
  ratingRank: null;
  ageRating: null;
  ageRatingGuide: null;
  subtype: string;
  status: string;
  tba: null;
  posterImage: TKitsuMangaPosterImage;
  coverImage: {
    tiny: string;
    large: string;
    small: string;
    medium: string;
    original: string;
    meta: TKitsuMangaPosterImageMeta;
  };
  chapterCount: null;
  volumeCount: number;
  serialization: string;
  mangaType: string;
}

export interface TKitsuMangaPosterImage {
  tiny: string;
  large: string;
  small: string;
  medium: string;
  original: string;
  meta: TKitsuMangaPosterImageMeta;
}

export interface TKitsuMangaPosterImageMeta {
  dimensions: Dimensions;
}

export interface Dimensions {
  tiny: TKitsuMangaLarge;
  large: TKitsuMangaLarge;
  small: TKitsuMangaLarge;
  medium: TKitsuMangaLarge;
}

export interface TKitsuMangaLarge {
  width: null;
  height: null;
}

export interface TKitsuMangaTitles {
  en: null;
  en_jp: string;
  ja_jp: string;
}

export interface TKitsuMangaLinks {
  self: string;
}

export interface TKitsuBaseResponseLinks {
  first: string;
  prev: string;
  last: string;
}

export interface TKitsuBaseResponseMeta {
  count: number;
}

export interface TKitsuMangaFilterParams {
  title?: string;
  limit: number;
}
