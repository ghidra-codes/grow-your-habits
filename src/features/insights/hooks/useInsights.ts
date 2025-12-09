import { useHabitAdherenceMap } from "@/features/habits/hooks/derived/useHabitAdherenceMap";
import { useRecentAdherenceMap } from "@/features/habits/hooks/derived/useRecentAdherenceMap";
import { useStatsStreakMap } from "@/features/statistics/hooks/useStatsStreakMap";
import type { HabitWithLogs } from "@/types/habit.types";
import type { Insight } from "@/types/insights.types";
import { useMemo, useState } from "react";
import { INSIGHTS_CONFIG } from "../config/insights-config";
import { buildInsightContext } from "../utils/buildInsightContext";
import { seededShuffle } from "../utils/helpers/seededShuffle";
import { insightGenerators } from "../utils/insightGenerators";

type UseInsightsArgs = {
	habits: HabitWithLogs[];
	weeklyGrowthChange: number;
	monthlyGrowthChange: number;
};

export const useInsights = ({ habits, weeklyGrowthChange, monthlyGrowthChange }: UseInsightsArgs) => {
	const adherenceMap = useHabitAdherenceMap(habits);
	const recentMap = useRecentAdherenceMap(habits);
	const streakMap = useStatsStreakMap(habits);
	const [seed] = useState(() => Math.random());

	// Compute context
	const context = useMemo(() => {
		if (habits.length === 0) return null;

		return buildInsightContext({
			habits,
			weeklyGrowthChange,
			monthlyGrowthChange,
			adherenceMap,
			recentMap,
			streakMap,
		});
	}, [habits, weeklyGrowthChange, monthlyGrowthChange, adherenceMap, recentMap, streakMap]);

	// Generate insights
	const insights = useMemo<Insight[]>(() => {
		if (!context) return [];

		return INSIGHTS_CONFIG.map((cfg) => insightGenerators[cfg.id](context)).filter(
			(i): i is Insight => i !== null
		);
	}, [context]);

	// Deterministic shuffle, returns 3 insights
	const displayedInsights = useMemo(() => {
		if (insights.length <= 3) return insights;

		return seededShuffle(insights, seed).slice(0, 3);
	}, [insights, seed]);

	return displayedInsights;
};
