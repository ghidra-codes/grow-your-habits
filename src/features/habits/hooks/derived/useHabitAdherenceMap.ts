import { useMemo } from "react";
import type { AdherenceMap, HabitWithLogs } from "@/types/habit.types";
import { calculateHabitAdherence } from "@/lib/calculateHabitAdherence";

export const useHabitAdherenceMap = (habits: HabitWithLogs[]): AdherenceMap => {
	return useMemo(() => {
		const adherenceMap: AdherenceMap = {};

		for (const habit of habits) adherenceMap[habit.id] = calculateHabitAdherence(habit);

		return adherenceMap;
	}, [habits]);
};
