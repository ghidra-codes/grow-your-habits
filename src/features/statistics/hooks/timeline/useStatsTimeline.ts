import type { HabitWithRelations } from "@/types/habit.types";
import type { TimelineMap, TimelineModesMap } from "@/types/statistics.types";
import { useStatsDailyTimeline } from "./useStatsDailyTimeline";
import { useStatsMonthlyTimeline } from "./useStatsMonthlyTimeline";
import { useStatsWeeklyTimeline } from "./useStatsWeeklyTimeline";

export const useStatsTimeline = (habits: HabitWithRelations[], modes: TimelineModesMap): TimelineMap => {
	return {
		daily: useStatsDailyTimeline(habits, modes),
		weekly: useStatsWeeklyTimeline(habits),
		monthly: useStatsMonthlyTimeline(habits),
	};
};
