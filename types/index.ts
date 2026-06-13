export interface Watch {
  id: string;
  brand: string;
  model: string;
  image: string;
  description?: string;
}

export interface Submission {
  id: string;
  // New format (3 watches)
  watchIds?: string[];
  selectedWatches?: Array<{
    id: string;
    brand: string;
    model: string;
  }>;
  // Legacy format (1 watch) - kept for backward compatibility
  watchId?: string;
  watchBrand?: string;
  watchModel?: string;
  // Common fields
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
