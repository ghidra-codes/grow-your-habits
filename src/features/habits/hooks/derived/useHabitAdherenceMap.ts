import { calculateDailyAdherence, calculatePeriodAdherence } from "@/lib/adherence";
import type { AdherenceMap, HabitWithLogs } from "@/types/habit.types";
import { useMemo } from "react";

export const useHabitAdherenceMap = (habits: HabitWithLogs[]): AdherenceMap => {
	return useMemo(() => {
		if (habits.length === 0) return {};

		const adherenceMap: AdherenceMap = {};

		for (const habit of habits) {
			if (habit.frequency_type === "daily") adherenceMap[habit.id] = calculateDailyAdherence(habit);
			else adherenceMap[habit.id] = calculatePeriodAdherence(habit);
		}

		return adherenceMap;
	}, [habits]);
};
