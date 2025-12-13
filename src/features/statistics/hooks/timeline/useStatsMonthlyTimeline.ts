import { generateMonthlySummary, splitTimelineSummary } from "@/lib/timeline";
import type { HabitWithLogs } from "@/types/habit.types";
import type { MonthlySummary, MonthlySummaryTimeline } from "@/types/statistic.types";
import { useMemo } from "react";

export const useStatsMonthlyTimeline = (habit: HabitWithLogs): MonthlySummaryTimeline =>
	useMemo(() => splitTimelineSummary<MonthlySummary>(generateMonthlySummary(habit), 4), [habit]);
