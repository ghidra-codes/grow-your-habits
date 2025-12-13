import type { HabitWithLogs } from "@/types/habit.types";
import { startOfDay } from "date-fns";

export const getDailyCompletionMap = (habit: HabitWithLogs) => {
	const map: Record<string, 1 | 0> = {};

	(habit.logs ?? []).forEach((log) => {
		const day = startOfDay(new Date(log.log_date));
		const key = day.toISOString().slice(0, 10);

		map[key] = 1;
	});

	return map;
};
