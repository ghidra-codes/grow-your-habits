import type { RecentAdherenceMap } from "@/types/habit.types";
import type { StreakMap, TrendDirection } from "@/types/statistic.types";
import { getStreakHealth } from "./getStreakHealth";
import { trendToScore } from "./trendToScore";

interface PlantHealthArgs {
	habitId: string;
	recentMap: RecentAdherenceMap;
	streakMap: StreakMap;
	trend: TrendDirection;
}

/**
 * Calculates a single habit's contribution to plant health.
 * Combines recent adherence, current streak strength, and behavioral trend
 * into a weighted score normalized to a discrete value.
 */
export const calculatePlantHealth = ({ habitId, recentMap, streakMap, trend }: PlantHealthArgs): number => {
	const adherence = recentMap[habitId]?.last7 ?? 0;

	const inactive = adherence === 0;

	const trendScore = inactive ? 0 : trendToScore(trend);
	const currentStreak = streakMap[habitId]?.currentStreak ?? 0;
	const streakHealth = getStreakHealth(currentStreak);

	const score = adherence * 0.5 + streakHealth * 0.3 + trendScore * 0.2;

	return Math.round(score);
};
