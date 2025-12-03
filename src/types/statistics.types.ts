import type { HabitWithRelations } from "./habit.types";

export type TimelineViewMode = "weekly" | "monthly";

export type TimelineModesMap = Record<string, TimelineViewMode>;

export type TimelineStatus = "completed" | "missed" | "pending" | "unavailable";

// DAILY TIMELINE
export interface TimelineEntry {
	date: string;
	status: TimelineStatus;
}

export type DailyPeriod = TimelineEntry[];
export type DailyPeriodTimeline = DailyPeriod[];

// SUMMARY TIMELINE

export type SummaryStatus = "completed" | "missed" | "pending";

export interface WeeklySummary {
	number: number;
	start: string;
	end: string;
	completed: number;
	target: number;
	status: SummaryStatus;
}
export type WeeklySummaryTimeline = (WeeklySummary | null)[][];

export interface MonthlySummary {
	month: number;
	year: number;
	completed: number;
	target: number;
	status: SummaryStatus;
}
export type MonthlySummaryTimeline = (MonthlySummary | null)[][];

export type SummaryTimeline = WeeklySummaryTimeline | MonthlySummaryTimeline;

// TIMELINE MAP
export interface TimelineMap {
	daily: Record<string, DailyPeriodTimeline>;
	weekly: Record<string, WeeklySummaryTimeline>;
	monthly: Record<string, MonthlySummaryTimeline>;
}

// PROCESSORS

export type DailyProcessor = {
	generate: (habit: HabitWithRelations) => TimelineEntry[];
	split: (entries: TimelineEntry[]) => DailyPeriodTimeline;
};

export type WeeklyProcessor = {
	generate: (habit: HabitWithRelations) => WeeklySummaryTimeline;
};

export type MonthlyProcessor = {
	generate: (habit: HabitWithRelations) => MonthlySummaryTimeline;
};

// STREAKS
export interface Streak {
	currentStreak: number;
	longestStreak: number;
}

export type StreakMap = Record<string, Streak>;

// TREND

export type TrendDirection = "improving" | "stable" | "declining";
