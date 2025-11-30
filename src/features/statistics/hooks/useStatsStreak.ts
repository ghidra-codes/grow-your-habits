import type { HabitWithRelations } from "@/types/habit.types";
import type { StreakMap } from "@/types/statistics.types";
import { calculateStreaks } from "@/utils/calculateStreaks";
import { useMemo } from "react";

export const useStatsStreak = (habits: HabitWithRelations[]): StreakMap => {
	return useMemo(() => {
		const streakMap: StreakMap = {};

		for (const habit of habits) {
			streakMap[habit.id] = calculateStreaks(habit);
		}

		return streakMap;
	}, [habits]);
};
