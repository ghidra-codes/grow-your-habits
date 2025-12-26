import type { FrequencyType, HabitWithLogs } from "@/types/habit.types";
import type { TimelineViewMode } from "@/types/statistic.types";
import DailyTimelineCarousel from "./DailyTimelineCarousel";
import WeeklyTimelineCarousel from "./WeeklyTimelineCarousel";
import MonthlyTimelineCarousel from "./MonthlyTimelineCarousel";
import type React from "react";

interface TimelineRendererProps {
	frequency: FrequencyType;
	habit: HabitWithLogs;
	mode: TimelineViewMode;
}
/**
 * Renders the appropriate timeline carousel based on habit frequency.
 * Acts as a thin dispatcher that selects daily, weekly, or monthly
 * timeline views without containing business logic.
 */
const TimelineRenderer: React.FC<TimelineRendererProps> = ({ frequency, habit, mode }) => {
	switch (frequency) {
		case "daily":
			return <DailyTimelineCarousel habit={habit} mode={mode} />;

		case "weekly":
			return <WeeklyTimelineCarousel habit={habit} />;

		case "monthly":
			return <MonthlyTimelineCarousel habit={habit} />;
	}
};

export default TimelineRenderer;
