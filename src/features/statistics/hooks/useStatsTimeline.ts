import type { HabitWithRelations } from "@/types/habit.types";
import type { PeriodTimeline, StatsTimelineResult, TimelineViewMode } from "@/types/statistics.types";
import { generateMonthlyTimeline } from "@/utils/generateMonthlyTimeline";
import { generateWeeklyTimeline } from "@/utils/generateWeeklyTimeline";
import { splitTimelineIntoMonths } from "@/utils/helpers/splitTimelineIntoMonths";
import { splitTimelineIntoWeeks } from "@/utils/helpers/splitTimelineIntoWeeks";

export function useStatsTimeline(
	habits: HabitWithRelations[],
	modes: Record<string, TimelineViewMode>
): StatsTimelineResult {
	const timelineMap: Record<string, PeriodTimeline> = {};

	for (const habit of habits) {
		const mode = modes[habit.id] ?? "weekly";

		if (mode === "weekly") {
			const raw = generateWeeklyTimeline(habit);
			timelineMap[habit.id] = splitTimelineIntoWeeks(raw);

			continue;
		}

		const raw = generateMonthlyTimeline(habit);
		timelineMap[habit.id] = splitTimelineIntoMonths(raw);
	}

	return { timelineMap };
}
