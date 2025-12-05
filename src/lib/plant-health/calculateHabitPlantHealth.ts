import type { ShortTermAdherenceMap } from "@/types/habit.types";
import type { StreakMap, TrendDirection } from "@/types/statistics.types";
import { getStreakHealth } from "./getStreakHealth";
import { trendToScore } from "./trendToScore";

interface PlantHealthArgs {
	habitId: string;
	shortTermAdherenceMap: ShortTermAdherenceMap;
	streakMap: StreakMap;
	trend: TrendDirection;
}

export const calculateHabitPlantHealth = ({
	habitId,
	shortTermAdherenceMap,
	streakMap,
	trend,
}: PlantHealthArgs): number => {
	const adherence = shortTermAdherenceMap[habitId]?.last7 ?? 0;

	const currentStreak = streakMap[habitId]?.currentStreak ?? 0;
	const streakHealth = getStreakHealth(currentStreak);

	const trendScore = trendToScore(trend);

	const score = adherence * 0.5 + streakHealth * 0.3 + trendScore * 0.2;

	return Math.round(score);
};
