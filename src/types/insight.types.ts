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
	title: string;
	description: string;
	message: string;
	type: InsightType;
};

export type InsightConfig = {
	id: InsightID;
	title: string;
	description: string;
};

export type InsightGenerated = {
	id: InsightID;
	message: string;
	type: InsightType;
};

export type HabitRef = { id: string; name: string };

export type InsightContext = {
	strongestDayIndex: number | null;
	strongestHabit: HabitRef | null;
	weakestHabit: HabitRef | null;
	weeklyTotal: number;
	monthlyTotal: number;
	weeklyGrowthChange: number;
	monthlyGrowthChange: number;
	bestStreakHabit: (HabitRef & { longestStreak: number }) | null;
	mostImprovedHabit: (HabitRef & { improvement: number }) | null;
};
