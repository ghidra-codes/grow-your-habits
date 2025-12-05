import { useMemo } from "react";
import type { HabitWithLogs } from "@/types/habit.types";
import type { MonthlySummary, MonthlySummaryTimeline } from "@/types/statistics.types";
import { splitTimelineSummary } from "@/lib/helpers/timeline/splitTimelineSummary";
import { generateMonthlySummary } from "@/lib/timeline/generateMonthlySummary";

export const useStatsMonthlyTimeline = (habit: HabitWithLogs): MonthlySummaryTimeline =>
	useMemo(() => splitTimelineSummary<MonthlySummary>(generateMonthlySummary(habit), 4), [habit]);
