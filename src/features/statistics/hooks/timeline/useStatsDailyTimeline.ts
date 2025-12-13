import {
	generateMonthlyTimeline,
	generateWeeklyTimeline,
	splitTimelineIntoMonths,
	splitTimelineIntoWeeks,
} from "@/lib/timeline";
import type { HabitWithLogs } from "@/types/habit.types";
import type { DailyPeriodTimeline, TimelineViewMode } from "@/types/statistic.types";
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

export const useStatsDailyTimeline = (habit: HabitWithLogs, mode: TimelineViewMode): DailyPeriodTimeline =>
	useMemo(() => {
		const { generate, split } = DAILY_PROCESSORS[mode];

		return split(generate(habit));
	}, [habit, mode]);
