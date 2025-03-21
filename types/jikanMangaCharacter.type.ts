import type { TMangaImage } from "./jikanManga.type";

export interface TMangaCharacter {
  role: string;
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: TMangaImage;
      webp: TMangaImage;
    };
    name: string;
  };
}
