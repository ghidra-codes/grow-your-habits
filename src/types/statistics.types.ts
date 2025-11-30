import type { HabitWithRelations } from "./habit.types";

export type TimelineViewMode = "weekly" | "monthly";

export type TimelineModesMap = Record<string, TimelineViewMode>;

export type TimelineStatus = "completed" | "missed" | "pending" | "unavailable";

export interface TimelineEntry {
	date: string;
	status: TimelineStatus;
}

// DAILY timeline (split into weeks or months)
export type DailyPeriodTimeline = TimelineEntry[][];

// WEEKLY summary
export interface WeeklySummary {
	weekNumber: number;
	year: number;
	start: string;
	end: string;
	completed: number;
	target: number;
	status: "completed" | "on-track" | "behind";
}
export type WeeklySummaryTimeline = WeeklySummary[];

// MONTHLY summary
export interface MonthlySummary {
	year: number;
	month: number;
	start: string;
	end: string;
	completed: number;
	target: number;
	status: "completed" | "on-track" | "behind";
}
export type MonthlySummaryTimeline = MonthlySummary[];

export interface TimelineMap {
	daily: Record<string, DailyPeriodTimeline>;
	weekly: Record<string, WeeklySummaryTimeline>;
	monthly: Record<string, MonthlySummaryTimeline>;
}

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
