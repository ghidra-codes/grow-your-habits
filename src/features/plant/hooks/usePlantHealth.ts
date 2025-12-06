import useShortTermAdherenceMap from "@/features/habits/hooks/derived/useShortTermAdherenceMap";
import { useStatsStreakMap } from "@/features/statistics/hooks/useStatsStreakMap";
import type { HabitWithLogs } from "@/types/habit.types";
import type { PlantHealth } from "@/types/plant.types";
import { calculateTrendDirection } from "@/lib/calculateTrendDirection";
import { calculateHabitPlantHealth } from "@/lib/plant-health/calculateHabitPlantHealth";
import { sanitizePlantHealth } from "@/lib/plant-health/sanitizePlantHealth";
import { useMemo } from "react";

export const usePlantHealth = (habits: HabitWithLogs[]): PlantHealth => {
	const streakMap = useStatsStreakMap(habits ?? []);
	const shortTermAdherenceMap = useShortTermAdherenceMap(habits ?? []);

	return useMemo(() => {
		if (!habits.length) return sanitizePlantHealth(0);

		const scores: number[] = [];

		for (const habit of habits) {
			const trend = calculateTrendDirection(habit, habit.frequency_type);

			const habitHealth = calculateHabitPlantHealth({
				habitId: habit.id,
				shortTermAdherenceMap,
				streakMap,
				trend,
			});

			scores.push(habitHealth);
		}

		const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

		return sanitizePlantHealth(Math.round(avg));
	}, [habits, streakMap, shortTermAdherenceMap]);
};
