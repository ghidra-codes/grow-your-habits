import type { HabitWithRelations } from "@/types/habit.types";
import type { WeeklySummary, WeeklySummaryTimeline } from "@/types/statistics.types";
import { splitTimelineSummary } from "@/utils/helpers/timeline/splitTimelineSummary";
import { generateWeeklySummary } from "@/utils/timeline/generateWeeklySummary";
import { useMemo } from "react";

export const useStatsWeeklyTimeline = (habits: HabitWithRelations[]): Record<string, WeeklySummaryTimeline> =>
	useMemo(() => {
		const map: Record<string, WeeklySummaryTimeline> = {};

		for (const habit of habits) {
			if (habit.frequency_type !== "weekly") continue;

			const weeks = generateWeeklySummary(habit);
			map[habit.id] = splitTimelineSummary<WeeklySummary>(weeks, 4);
		}

		return map;
	}, [habits]);
