import { useRecentAdherenceMap } from "@/features/habits/hooks/derived/useRecentAdherenceMap";
import { useStatsStreakMap } from "@/features/statistics/hooks/useStatsStreakMap";
import { calculatePlantHealth, sanitizePlantHealth } from "@/lib/plant";
import { calculateTrendDirection } from "@/lib/trend/calculateTrendDirection";
import type { HabitWithLogs } from "@/types/habit.types";
import type { PlantHealth } from "@/types/plant.types";
import { useMemo } from "react";

export const useCalculatedPlantHealth = (habits: HabitWithLogs[], hasHabitLogs: boolean): PlantHealth => {
	const streakMap = useStatsStreakMap(habits ?? []);
	const recentMap = useRecentAdherenceMap(habits ?? []);

	return useMemo(() => {
		if (!hasHabitLogs) return sanitizePlantHealth(0);

		const scores: number[] = [];

		for (const habit of habits) {
			const trend = calculateTrendDirection(habit, habit.frequency_type);

			const habitHealth = calculatePlantHealth({
				habitId: habit.id,
				recentMap,
				streakMap,
				trend,
			});

			scores.push(habitHealth);
		}

		const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

		return sanitizePlantHealth(Math.round(avg));
	}, [habits, streakMap, recentMap, hasHabitLogs]);
};
