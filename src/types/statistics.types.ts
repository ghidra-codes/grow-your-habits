export type TimelineViewMode = "weekly" | "monthly";

export type TimelineStatus = "completed" | "missed" | "unavailable";

export interface TimelineEntry {
	date: string;
	status: TimelineStatus;
}

// Groups (Weekly or Monthly)
export type PeriodTimeline = TimelineEntry[][];

export interface StatsTimelineResult {
	timelineMap: Record<string, PeriodTimeline>;
}
