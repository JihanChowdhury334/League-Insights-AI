// ============================================
// RIFT REWIND - TYPE DEFINITIONS
// ============================================

// ============================================
// API Response Types (MATCHED TO BACKEND)
// ============================================

export interface GetStatsResponse {
  profile: {
    gameName: string;
    tagLine: string;
    puuid: string;
    total_matches: number;
    total_wins: number;
    total_losses: number;
    win_rate: string;
  };
  
  core_averages: {
    kills: number;
    deaths: number;
    assists: number;
    cs_per_min: number;
  };
  
  impact_stats: {
    kill_participation: number;
    damage_share: number;
    gold_share: number;
    vision_share: number;
  };
  
  role_distribution: Record<string, number>;
  
  role_performance: Record<string, {
    avg_kills: number;
    avg_deaths: number;
    avg_assists: number;
    avg_damage: number;
    avg_cs: number;
    avg_kp: number;
  }>;
  
  role_impact_stats: Record<string, {
    avg_damage_share: number;
    avg_gold_share: number;
    avg_vision_share: number;
    avg_kp: number;
  }>;
  
  most_played_champion: string;
  
  game_mode_distribution: Record<string, number>;
  
  extreme_games: {
    highest_kill_game: ExtremeGame;
    highest_death_game: ExtremeGame;
    highest_assist_game: ExtremeGame;
    highest_damage_game: ExtremeGame;
    highest_damage_taken_game: ExtremeGame;
    highest_cs_game: ExtremeGame;
    highest_cs_per_min_game: ExtremeGame;
    best_kda_game: ExtremeGame & { kda: number };
    worst_kda_game: ExtremeGame & { kda: number };
    fastest_game: ExtremeGame & { duration: number };
    longest_game: ExtremeGame & { duration: number };
  };
  
  monthly_stats: Record<string, MonthlyStats>;
  monthly_roles: Record<string, Record<string, number>>;
  monthly_champions: Record<string, Record<string, number>>;
}

export interface ExtremeGame {
  match_id: string;
  champion: string;
  role: string;
  kills?: number;
  deaths?: number;
  assists?: number;
  damage?: number;
  damage_taken?: number;
  cs?: number;
  cs_per_min?: number;
}

export interface MonthlyStats {
  matches: number;
  wins: number;
  winrate: number;
  avg_kills: number;
  avg_deaths: number;
  avg_assists: number;
  avg_cs_per_min: number;
  avg_kp: number;
  avg_damage_share: number;
  avg_gold_share: number;
}

// ============================================
// Timeline Stats Response (MATCHED TO BACKEND)
// ============================================

export interface GetTimelineStatsResponse {
  puuid: string;
  total_matches: number;
  
  average_insights: {
    early_dominance: number;
    midgame_swing: number;
    consistency_score: number;
    roam_score: number;
    biggest_spike: number;
    biggest_throw: number;
    avg_level6_time: number;
    avg_level11_time: number;
    avg_level16_time: number;
  };
  
  playstyle_identity: {
    early_game: string;
    consistency: string;
    roaming: string;
    risk_profile?: string;
  };
  
  comeback_pattern: {
    comeback_wins: number;
    throws: number;
    dominant_wins: number;
    fell_behind_losses: number;
    neutral_games: number;
  };
  
  heatmap: {
    kill_positions: Array<{ x: number; y: number }>;
    objectives: {
      dragon: number;
      baron: number;
      herald: number;
      tower: number;
      inhibitor: number;
    };
  };
  
  most_extreme_games: {
    best_spike_game: {
      match_id: string;
      spike: number;
      early_dominance: number;
      comeback_type: string;
    };
    worst_throw_game: {
      match_id: string;
      throw: number;
      early_dominance: number;
      comeback_type: string;
    };
  };
}

// ============================================
// Recap Response (MATCHED TO BACKEND)
// ============================================

export interface GenerateRecapResponse {
  recap: {
    personality_profile: string;
    strengths: string[];
    weaknesses: string[];
    playstyle_summary: string;
    actionable_tip: string;
    fun_highlight: string;
  };
  stats_summary: {
    total_matches: number;
    win_rate: string;
    most_played_champion: string;
  };
}

// ============================================
// API Endpoints Status (MATCHED TO BACKEND)
// ============================================

export interface ProcessTimelinesResponse {
  processed: number;
  skipped: number;
  gameName: string;
  tagLine: string;
  puuid: string;
  message: string;
}

// ============================================
// UI State Types
// ============================================

export interface SearchState {
  gameName: string;
  tagLine: string;
  region: string;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  statsData: GetStatsResponse | null;
  timelineData: GetTimelineStatsResponse | null;
  recapData: GenerateRecapResponse | null;
  searchState: SearchState;
}
