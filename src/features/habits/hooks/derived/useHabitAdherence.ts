import { useMemo } from "react";
import type { AdherenceMap, HabitWithRelations } from "@/types/habit.types";
import { calculateHabitAdherence } from "@/utils/calculateHabitAdherence";

export const useHabitAdherence = (habits: HabitWithRelations[]): AdherenceMap => {
	return useMemo(() => {
		const adherenceMap: AdherenceMap = {};

		for (const habit of habits) {
			const logCount = habit.logs?.length ?? 0;
			const schedule = habit.schedules ?? [];

			adherenceMap[habit.id] = calculateHabitAdherence(habit, logCount, schedule);
		}

		return adherenceMap;
	}, [habits]);
};
