export type TimelineViewMode = "daily" | "weekly" | "monthly";

export type TimelineStatus = "completed" | "missed" | "unavailable";

export interface TimelineEntry {
	date: string;
	status: TimelineStatus;
}

// Groups (Weekly or Monthly)
export type PeriodTimeline = TimelineEntry[][];

export type DailyTimelineMap = Record<string, TimelineEntry[]>;
export type WeeklyTimelineMap = Record<string, PeriodTimeline>;
export type MonthlyTimelineMap = Record<string, PeriodTimeline>;

export type TimelineStatsResult =
	| { mode: "daily"; timelineMap: DailyTimelineMap }
	| { mode: "weekly"; timelineMap: WeeklyTimelineMap }
	| { mode: "monthly"; timelineMap: MonthlyTimelineMap };
