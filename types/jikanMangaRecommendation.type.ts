import type { TMangaImages } from "./jikanManga.type";

export interface TRecommendationEntry {
  mal_id: number;
  url: string;
  title: string;
  images: TMangaImages;
}

export interface TMangaRecommendation {
  entry: any[];
  url: string;
  votes: number;
}
