import type { HabitWithLogs } from "./habit.types";

export type TimelineViewMode = "weekly" | "monthly";

export type TimelineModesMap = Record<string, TimelineViewMode>;

export type TimelineStatus = "completed" | "missed" | "pending" | "unavailable";

export type TimelineCells = "completed" | "missed" | "placeholder";

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

export type SummaryPeriod = WeeklySummary | MonthlySummary;

// TIMELINE MAP
export interface TimelineMap {
	daily: Record<string, DailyPeriodTimeline>;
	weekly: Record<string, WeeklySummaryTimeline>;
	monthly: Record<string, MonthlySummaryTimeline>;
}

// PROCESSORS

export type DailyProcessor = {
	generate: (habit: HabitWithLogs) => TimelineEntry[];
	split: (entries: TimelineEntry[]) => DailyPeriodTimeline;
};

export type WeeklyProcessor = {
	generate: (habit: HabitWithLogs) => WeeklySummaryTimeline;
};

export type MonthlyProcessor = {
	generate: (habit: HabitWithLogs) => MonthlySummaryTimeline;
};

// STREAKS
export interface Streak {
	currentStreak: number;
	longestStreak: number;
}

export type StreakMap = Record<string, Streak>;

// TREND

export type TrendDirection = "improving" | "stable" | "declining";

// TIMELINE CAROUSEL PROPS

export type TimelineCarouselProps =
	| {
			frequency: "daily";
			data: DailyPeriodTimeline;
			mode: TimelineViewMode;
			compact: boolean;
	  }
	| {
			frequency: "weekly";
			data: WeeklySummaryTimeline;
	  }
	| {
			frequency: "monthly";
			data: MonthlySummaryTimeline;
	  };
