export interface TMangaImage {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface TMangaImages {
  jpg: TMangaImage;
  webp: TMangaImage;
}

export interface TMangaPublished {
  from?: string;
  to?: string;
  prop?: {
    from?: { day: number | null; month: number | null; year: number | null };
    to?: { day: number | null; month: number | null; year: number | null };
    string?: string;
  };
}

export interface TMangaTitle {
  type: string;
  title: string;
}

export interface TMangaAuthor {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface TMangaSerialization {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface TMangaGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface TMangaTheme {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface TMangaDemographic {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface TMangaResponse {
  mal_id: number;
  url: string;
  images: TMangaImages;
  approved: boolean;
  titles: TMangaTitle[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  chapters: number;
  volumes: number;
  status: string;
  publishing: boolean;
  published: TMangaPublished;
  score: number;
  scored: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  authors: TMangaAuthor[];
  serializations: TMangaSerialization[];
  genres: TMangaGenre[];
  explicit_genres: any[];
  themes: TMangaTheme[];
  demographics: TMangaDemographic[];
}

export interface TMangaFilterParams {
  page: number;
  limit: number;
  order_by: string;
  sort: "desc" | "asc";
  q?: string;
  type?: "manga" | "manhwa" | "manhua";
}

export interface TMangaGenreResponse {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}
