import useShortTermAdherence from "@/features/statistics/hooks/useShortTermAdherence";
import { useStatsStreak } from "@/features/statistics/hooks/useStatsStreak";
import type { HabitWithRelations } from "@/types/habit.types";
import type { PlantHealth } from "@/types/plant.types";
import { calculateTrendDirection } from "@/utils/calculateTrendDirection";
import { calculateHabitPlantHealth } from "@/utils/plant-health/calculateHabitPlantHealth";
import { sanitizePlantHealth } from "@/utils/plant-health/sanitizePlantHealth";
import { useMemo } from "react";

export const usePlantHealth = ({ habits }: { habits: HabitWithRelations[] }): PlantHealth => {
	const streakMap = useStatsStreak(habits ?? []);
	const shortTermAdherenceMap = useShortTermAdherence(habits ?? []);

	return useMemo(() => {
		if (!habits.length) return sanitizePlantHealth(0);

		const scores: number[] = [];

		for (const habit of habits) {
			const trend = calculateTrendDirection(habit);

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
