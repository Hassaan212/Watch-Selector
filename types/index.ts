export interface Watch {
  id: string;
  brand: string;
  model: string;
  image: string;
  description?: string;
}

export interface Submission {
  id: string;
  // Round 1: Multiple watches (5 selections)
  watchIds?: string[];
  selectedWatches?: Array<{
    id: string;
    brand: string;
    model: string;
  }>;
  // Round 2: Final winner (1 ultimate favorite)
  finalWinnerId?: string;
  finalWinner?: {
    id: string;
    brand: string;
    model: string;
  };
  // Legacy format (1 or 3 watches) - kept for backward compatibility
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
