import { useMemo } from "react";
import type { HabitWithLogs } from "@/types/habit.types";
import type { DailyPeriodTimeline, TimelineViewMode } from "@/types/statistics.types";
import { splitTimelineIntoMonths } from "@/lib/helpers/timeline/splitTimelineIntoMonths";
import { splitTimelineIntoWeeks } from "@/lib/helpers/timeline/splitTimelineIntoWeeks";
import { generateMonthlyTimeline } from "@/lib/timeline/generateMonthlyTimeline";
import { generateWeeklyTimeline } from "@/lib/timeline/generateWeeklyTimeline";

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
