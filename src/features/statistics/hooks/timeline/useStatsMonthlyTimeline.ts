import type { HabitWithRelations } from "@/types/habit.types";
import type { MonthlySummaryTimeline } from "@/types/statistics.types";
import { generateMonthlySummary } from "@/utils/timeline/generateMonthlySummary";
import { useMemo } from "react";

export const useStatsMonthlyTimeline = (
	habits: HabitWithRelations[]
): Record<string, MonthlySummaryTimeline> =>
	useMemo(() => {
		const map: Record<string, MonthlySummaryTimeline> = {};

		for (const habit of habits) {
			if (habit.frequency_type !== "monthly") continue;

			map[habit.id] = generateMonthlySummary(habit);
		}

		return map;
	}, [habits]);
