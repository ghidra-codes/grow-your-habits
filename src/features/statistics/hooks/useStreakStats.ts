import type { HabitWithRelations } from "@/types/habit.types";
import { calculateStreaks } from "@/utils/calculateStreaks";

export const useStreakStats = (habits: HabitWithRelations[]) => {
	const streakMap: Record<string, { currentStreak: number; longestStreak: number }> = {};

	for (const habit of habits) {
		streakMap[habit.id] = calculateStreaks(habit);
	}

	return { streakMap };
};
