import { useMemo } from "react";
import type { HabitWithLogs } from "@/types/habit.types";
import type { WeeklySummary, WeeklySummaryTimeline } from "@/types/statistic.types";
import { splitTimelineSummary } from "@/lib/helpers/timeline/splitTimelineSummary";
import { generateWeeklySummary } from "@/lib/timeline/generateWeeklySummary";

export const useStatsWeeklyTimeline = (habit: HabitWithLogs): WeeklySummaryTimeline =>
	useMemo(() => splitTimelineSummary<WeeklySummary>(generateWeeklySummary(habit), 4), [habit]);
