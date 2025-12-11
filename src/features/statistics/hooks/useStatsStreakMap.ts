import type { HabitWithLogs } from "@/types/habit.types";
import type { StreakMap } from "@/types/statistic.types";
import { calculateStreaks } from "@/lib/calculateStreaks";
import { useMemo } from "react";

export const useStatsStreakMap = (habits: HabitWithLogs[]): StreakMap => {
	return useMemo(() => {
		if (habits.length === 0) return {};

		const streakMap: StreakMap = {};

		for (const habit of habits) streakMap[habit.id] = calculateStreaks(habit);

		return streakMap;
	}, [habits]);
};
