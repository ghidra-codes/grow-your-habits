import { subDays, eachDayOfInterval, startOfDay } from "date-fns";
import type { HabitWithRelations } from "@/types/habit.types";
import { getDailyCompletionMap } from "./helpers/getDailyCompletionMap";
import type { TrendDirection } from "@/types/statistics.types";

export const calculateTrendDirection = (habit: HabitWithRelations): TrendDirection => {
	const dailyMap = getDailyCompletionMap(habit);

	const today = startOfDay(new Date());

	const last14Start = subDays(today, 13);
	const prev14Start = subDays(today, 27);

	// WINDOWS
	const last14Interval = eachDayOfInterval({ start: last14Start, end: today });
	const prev14Interval = eachDayOfInterval({ start: prev14Start, end: subDays(today, 14) });

	// COUNT COMPLETIONS INSIDE WINDOWS
	const countCompleted = (interval: Date[]) => {
		let completed = 0;

		for (const day of interval) {
			const key = day.toISOString().slice(0, 10);
			if (dailyMap[key] === 1) completed++;
		}

		return completed;
	};

	const last14Completed = countCompleted(last14Interval);
	const prev14Completed = countCompleted(prev14Interval);

	// COMPARE
	if (last14Completed > prev14Completed) return "improving";
	if (last14Completed < prev14Completed) return "declining";

	return "stable";
};
