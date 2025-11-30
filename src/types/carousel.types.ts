import type {
	DailyPeriodTimeline,
	MonthlySummaryTimeline,
	TimelineViewMode,
	WeeklySummaryTimeline,
} from "./statistics.types";

// daily
export type DailyCarouselProps = {
	frequency: "daily";
	data: DailyPeriodTimeline;
	compact?: boolean;
	mode: TimelineViewMode;
};

// weekly
export type WeeklyCarouselProps = {
	frequency: "weekly";
	data: WeeklySummaryTimeline;
};

// monthly
export type MonthlyCarouselProps = {
	frequency: "monthly";
	data: MonthlySummaryTimeline;
};

// custom (placeholder for now)
export type CustomCarouselProps = {
	frequency: "custom";
	data: [];
	compact?: boolean;
	mode: TimelineViewMode;
};

export type TimelineCarouselProps =
	| DailyCarouselProps
	| WeeklyCarouselProps
	| MonthlyCarouselProps
	| CustomCarouselProps;
