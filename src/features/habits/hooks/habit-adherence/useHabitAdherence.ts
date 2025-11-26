import type { AdherenceMap, HabitWithRelations } from "@/types/habit.types";
import { calculateHabitAdherence } from "@/utils/calculateHabitAdherence";

export const useHabitAdherence = (habits: HabitWithRelations[]): { adherenceMap: AdherenceMap } => {
	const adherenceMap: AdherenceMap = {};

	for (const habit of habits) {
		const logCount = habit.logs?.length ?? 0;
		const schedule = habit.schedules?.map((schedule) => schedule.weekday) ?? [];

		adherenceMap[habit.id] = calculateHabitAdherence(habit, logCount, schedule);
	}

	return { adherenceMap };
};
