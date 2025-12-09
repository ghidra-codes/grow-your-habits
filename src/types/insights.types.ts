import type { AdherenceMap, HabitWithLogs, RecentAdherenceMap } from "./habit.types";
import type { StreakMap } from "./statistics.types";

export type InsightID =
	| "strongest-day"
	| "strongest-habit"
	| "weakest-habit"
	| "weekly-consistency"
	| "weekly-growth"
	| "monthly-growth"
	| "best-streak-habit"
	| "monthly-consistency"
	| "most-improved-habit";

export type InsightType = "positive" | "neutral" | "negative";

export type Insight = {
	id: InsightID;
	type: InsightType;
	message: string;
};

export type InsightConfig = {
	id: InsightID;
	title: string;
	description?: string;
	defaultType?: InsightType;
};

export type InsightContext = {
	habits: HabitWithLogs[];
	adherenceMap: AdherenceMap;
	recentMap: RecentAdherenceMap;
	streakMap: StreakMap;
	completionsByDay: Record<number, number>;
	strongestDayIndex: number | null;
	strongestHabit: { id: string; name: string; adherence: number } | null;
	weakestHabit: { id: string; name: string; adherence: number } | null;
	weeklyTotal: number;
	monthlyTotal: number;
	weeklyGrowthChange: number;
	monthlyGrowthChange: number;
	bestStreakHabit: { id: string; name: string; longestStreak: number } | null;
	mostImprovedHabit: { id: string; name: string; improvement: number } | null;
};
