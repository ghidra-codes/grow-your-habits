import { differenceInCalendarDays, startOfDay } from "date-fns";
import type { HabitWithRelations } from "@/types/habit.types";

export const calculateStreaks = (habit: HabitWithRelations) => {
	const logs = habit.logs ?? [];
	if (logs.length === 0) {
		return { currentStreak: 0, longestStreak: 0 };
	}

	// Normalize and sort logs (oldest → newest)
	const dates = logs
		.map((log) => startOfDay(new Date(log.log_date)))
		.sort((a, b) => a.getTime() - b.getTime());

	let currentStreak = 1;
	let longestStreak = 1;

	for (let i = 1; i < dates.length; i++) {
		const diff = differenceInCalendarDays(dates[i], dates[i - 1]);

		if (diff === 1) {
			currentStreak++;
		} else if (diff > 1) {
			currentStreak = 1;
		}

		if (currentStreak > longestStreak) {
			longestStreak = currentStreak;
		}
	}

	// Check if the streak extends to today
	const today = startOfDay(new Date());
	const lastLog = dates[dates.length - 1];
	const diffFromToday = differenceInCalendarDays(today, lastLog);

	if (diffFromToday > 1) {
		// streak ended before yesterday
		currentStreak = 0;
	} else if (diffFromToday === 1 || diffFromToday === 0) {
		// streak is valid
	} else {
		// negative? should not happen but safe guard
		currentStreak = 0;
	}

	return { currentStreak, longestStreak };
};
