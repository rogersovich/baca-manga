export interface TStatisticScore {
  score: number;
  votes: number;
  percentage: number;
}

export interface TMangaStatistic {
  reading: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_read: number;
  total: number;
  scores: TStatisticScore[];
}
