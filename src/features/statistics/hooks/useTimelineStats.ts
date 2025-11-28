import type { HabitWithRelations } from "@/types/habit.types";
import type {
	PeriodTimeline,
	TimelineEntry,
	TimelineStatsResult,
	TimelineViewMode,
} from "@/types/statistics.types";
import { generateDailyTimeline } from "@/utils/generateDailyTimeline";
import { generateMonthlyTimeline } from "@/utils/generateMonthlyTimeline";
import { generateWeeklyTimeline } from "@/utils/generateWeeklyTimeline";
import { splitTimelineIntoMonths } from "@/utils/helpers/splitTimelineIntoMonths";
import { splitTimelineIntoWeeks } from "@/utils/helpers/splitTimelineIntoWeeks";

export function useTimelineStats(
	habits: HabitWithRelations[],
	mode: TimelineViewMode = "weekly"
): TimelineStatsResult {
	if (mode === "daily") {
		const timelineMap: Record<string, TimelineEntry[]> = {};

		for (const habit of habits) {
			timelineMap[habit.id] = generateDailyTimeline(habit);
		}

		return { mode, timelineMap };
	}

	if (mode === "weekly") {
		const timelineMap: Record<string, PeriodTimeline> = {};

		for (const habit of habits) {
			const raw = generateWeeklyTimeline(habit);
			timelineMap[habit.id] = splitTimelineIntoWeeks(raw);
		}

		return { mode, timelineMap };
	}

	const timelineMap: Record<string, PeriodTimeline> = {};

	for (const habit of habits) {
		const raw = generateMonthlyTimeline(habit);
		timelineMap[habit.id] = splitTimelineIntoMonths(raw);
	}

	return { mode, timelineMap };
}
