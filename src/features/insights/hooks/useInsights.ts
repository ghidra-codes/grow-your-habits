import { useHabitAdherenceMap } from "@/features/habits/hooks/derived/useHabitAdherenceMap";
import useShortTermAdherenceMap from "@/features/habits/hooks/derived/useShortTermAdherenceMap";
import { useStatsStreakMap } from "@/features/statistics/hooks/useStatsStreakMap";
import type { HabitWithLogs } from "@/types/habit.types";
import type { Insight } from "@/types/insights.types";
import { useMemo } from "react";
import { INSIGHTS_CONFIG } from "../config/insightsConfig";
import { buildInsightContext } from "../utils/buildInsightContext";
import { seededShuffle } from "../utils/helpers/seededShuffle";
import { insightGenerators } from "../utils/insightGenerators";

type UseInsightsArgs = {
	habits: HabitWithLogs[];
	weeklyGrowthChange: number;
};

export const useInsights = ({ habits, weeklyGrowthChange }: UseInsightsArgs) => {
	const adherenceMap = useHabitAdherenceMap(habits);
	const shortTermMap = useShortTermAdherenceMap(habits);
	const streakMap = useStatsStreakMap(habits);

	// Compute context
	const context = useMemo(() => {
		if (habits.length === 0) return null;

		return buildInsightContext({
			habits,
			weeklyGrowthChange,
			adherenceMap,
			shortTermMap,
			streakMap,
		});
	}, [habits, weeklyGrowthChange, adherenceMap, shortTermMap, streakMap]);

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

		const seed = insights.length * 137 + (insights[0]?.id.length ?? 1) * 997;

		return seededShuffle(insights, seed).slice(0, 3);
	}, [insights]);

	return displayedInsights;
};
