export interface TMangaReview {
  mal_id: number;
  url: string;
  type: string;
  reactions: TReviewReactions;
  date: string;
  review: string;
  score: number;
  tags: string[];
  is_spoiler: boolean;
  is_preliminary: boolean;
  chapters_read: null;
  user: TReviewUser;
}

export interface TReviewReactions {
  overall: number;
  nice: number;
  love_it: number;
  funny: number;
  confusing: number;
  informative: number;
  well_written: number;
  creative: number;
}

export interface TReviewUser {
  url: string;
  username: string;
  images: TReviewImages;
}

export interface TReviewImages {
  jpg: TReviewImage;
  jwebppg: TReviewImage;
}

export interface TReviewImage {
  image_url: string;
}
