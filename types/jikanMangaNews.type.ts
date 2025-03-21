export interface TNewImage {
  image_url: string;
}

export interface TNewImages {
  jpg: TNewImage;
}

export interface TMangaNews {
  mal_id: number;
  url: string;
  title: string;
  date: string;
  author_username: string;
  author_url: string;
  forum_url: string;
  images: TNewImages;
  comments: number;
  excerpt: string;
}
