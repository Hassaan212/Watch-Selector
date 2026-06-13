export interface Watch {
  id: string;
  brand: string;
  model: string;
  image: string;
  description?: string;
}

export interface Submission {
  id: string;
  watchId: string;
  watchBrand: string;
  watchModel: string;
  timestamp: Date;
  sessionId: string;
  nickname?: string;
}

export interface WatchStats {
  watchId: string;
  brand: string;
  model: string;
  count: number;
  percentage: number;
  rank: number;
}
