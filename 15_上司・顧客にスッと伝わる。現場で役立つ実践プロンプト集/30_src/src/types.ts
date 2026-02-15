export interface PromptCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PromptItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  content: string;
  reflectionPrompt?: string;
  usageCount: number;
  lastUsed?: Date;
  firstUsed?: Date;
  isFavorite: boolean;
  sampleFiles?: string[];
}

export interface UsageSession {
  id: string;
  date: Date;
  promptId: string;
  duration?: number;
  filesCreated?: string[];
  notes?: string;
}

export interface DailyStats {
  date: string;
  totalSessions: number;
  promptsUsed: string[];
  filesCreated: number;
  totalTime: number;
}

export interface UserStats {
  totalUsage: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  promptStats: { [promptId: string]: PromptStats };
  dailyActivity: { [date: string]: number };
}

export interface PromptStats {
  count: number;
  firstUsed: string;
  lastUsed: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}
