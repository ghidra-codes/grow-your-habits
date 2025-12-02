import type { HabitWithRelations } from "@/types/habit.types";
import type { MonthlySummary, MonthlySummaryTimeline } from "@/types/statistics.types";
import { splitTimelineSummary } from "@/utils/helpers/timeline/splitTimelineSummary";
import { generateMonthlySummary } from "@/utils/timeline/generateMonthlySummary";
import { useMemo } from "react";

export const useStatsMonthlyTimeline = (
	habits: HabitWithRelations[]
): Record<string, MonthlySummaryTimeline> =>
	useMemo(() => {
		const map: Record<string, MonthlySummaryTimeline> = {};

		for (const habit of habits) {
			if (habit.frequency_type !== "monthly") continue;

			const months = generateMonthlySummary(habit);
			map[habit.id] = splitTimelineSummary<MonthlySummary>(months, 4);
		}

		return map;
	}, [habits]);
