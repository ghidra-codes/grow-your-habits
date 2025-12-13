import { generateWeeklySummary, splitTimelineSummary } from "@/lib/timeline";
import type { HabitWithLogs } from "@/types/habit.types";
import type { WeeklySummary, WeeklySummaryTimeline } from "@/types/statistic.types";
import { useMemo } from "react";

export const useStatsWeeklyTimeline = (habit: HabitWithLogs): WeeklySummaryTimeline =>
	useMemo(() => splitTimelineSummary<WeeklySummary>(generateWeeklySummary(habit), 4), [habit]);
