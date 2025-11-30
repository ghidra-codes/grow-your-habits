import type { HabitWithRelations } from "@/types/habit.types";
import type { WeeklySummaryTimeline } from "@/types/statistics.types";
import { generateWeeklySummary } from "@/utils/timeline/generateWeeklySummary";
import { useMemo } from "react";

export const useStatsWeeklyTimeline = (habits: HabitWithRelations[]): Record<string, WeeklySummaryTimeline> =>
	useMemo(() => {
		const map: Record<string, WeeklySummaryTimeline> = {};

		for (const habit of habits) {
			if (habit.frequency_type !== "weekly") continue;

			map[habit.id] = generateWeeklySummary(habit);
		}

		return map;
	}, [habits]);
