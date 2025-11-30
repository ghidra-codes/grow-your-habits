import type { HabitWithRelations } from "@/types/habit.types";
import type { DailyPeriodTimeline, TimelineModesMap } from "@/types/statistics.types";
import { splitTimelineIntoMonths } from "@/utils/helpers/timeline/splitTimelineIntoMonths";
import { splitTimelineIntoWeeks } from "@/utils/helpers/timeline/splitTimelineIntoWeeks";
import { generateMonthlyTimeline } from "@/utils/timeline/generateMonthlyTimeline";
import { generateWeeklyTimeline } from "@/utils/timeline/generateWeeklyTimeline";
import { useMemo } from "react";

const DAILY_PROCESSORS = {
	weekly: {
		generate: generateWeeklyTimeline,
		split: splitTimelineIntoWeeks,
	},
	monthly: {
		generate: generateMonthlyTimeline,
		split: splitTimelineIntoMonths,
	},
} as const;

export const useStatsDailyTimeline = (
	habits: HabitWithRelations[],
	modes: TimelineModesMap
): Record<string, DailyPeriodTimeline> =>
	useMemo(() => {
		const map: Record<string, DailyPeriodTimeline> = {};

		for (const habit of habits) {
			if (habit.frequency_type !== "daily") continue;

			const mode = modes[habit.id] ?? "weekly";
			const { generate, split } = DAILY_PROCESSORS[mode];

			map[habit.id] = split(generate(habit));
		}

		return map;
	}, [habits, modes]);
