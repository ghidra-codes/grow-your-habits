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

	const insights = useMemo(() => {
		if (habits.length === 0) return [];

		// Build context
		const context = buildInsightContext({
			habits,
			weeklyGrowthChange,
			monthlyGrowthChange,
			adherenceMap,
			recentMap,
			streakMap,
		});

		// Generate insights
		const generated = INSIGHTS_CONFIG.map((cfg) => {
			const result = insightGenerators[cfg.id](context);
			if (!result) return null;

			return {
				id: cfg.id,
				title: cfg.title,
				description: cfg.description,
				message: result.message,
				type: result.type,
			} satisfies Insight;
		}).filter((i): i is Insight => i !== null);

		// Shuffle and limit to 3
		if (generated.length <= 3) return generated;
		return seededShuffle(generated, seed).slice(0, 3);
	}, [habits, weeklyGrowthChange, monthlyGrowthChange, adherenceMap, recentMap, streakMap, seed]);

	return insights;
};
