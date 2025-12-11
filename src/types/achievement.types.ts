import type { HabitWithLogs } from "./habit.types";
import type { Database } from "./supabase.types";

// USER ACHIEVEMENTS

export type UserAchievement = Database["public"]["Tables"]["user_achievements"]["Row"];

export type UserAchievementInsert = Database["public"]["Tables"]["user_achievements"]["Insert"];

export type UserAchievementUpdate = Database["public"]["Tables"]["user_achievements"]["Update"];

// STATIC ACHIEVEMENT DEFINITIONS

export type AchievementType = "logging" | "streak" | "adherence" | "growth" | "other";

export type AchievementDefinition = {
	id: string;
	title: string;
	description: string;
	badge: string;
	type: AchievementType;
};

export type Achievement = AchievementDefinition & {
	unlocked: boolean;
	unlockedAt?: string | null;
	notifiedAt?: string | null;
	entryId?: string | null;
};

export type AchievementUnlockMap = Record<string, boolean>;

export type AchievementContext = {
	habits: HabitWithLogs[];
	totalLogs: number;
	habitCount: number;
	streak: number;
	plantStage: number;
	dailyConsistency: boolean;
	weeklyGoalHit: boolean;
	monthlyGoalHit: boolean;
	maxLogsForOneHabit: number;
};

export type AchievementFilters = AchievementType | "all" | "unlocked" | "locked";
