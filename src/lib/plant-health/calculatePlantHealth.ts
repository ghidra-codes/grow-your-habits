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

export const calculatePlantHealth = ({ habitId, recentMap, streakMap, trend }: PlantHealthArgs): number => {
	const adherence = recentMap[habitId]?.last7 ?? 0;

	const currentStreak = streakMap[habitId]?.currentStreak ?? 0;
	const streakHealth = getStreakHealth(currentStreak);

	const trendScore = trendToScore(trend);

	const score = adherence * 0.5 + streakHealth * 0.3 + trendScore * 0.2;

	return Math.round(score);
};
