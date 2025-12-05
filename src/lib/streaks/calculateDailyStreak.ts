import { differenceInCalendarDays, startOfDay } from "date-fns";
import type { HabitWithLogs } from "@/types/habit.types";

export const calculateDailyStreak = (habit: HabitWithLogs) => {
	if (!habit.logs) return { currentStreak: 0, longestStreak: 0 };

	const logs = habit.logs
		.map((l) => startOfDay(new Date(l.log_date)))
		.sort((a, b) => a.getTime() - b.getTime());

	if (logs.length === 0) return { currentStreak: 0, longestStreak: 0 };

	let currentStreak = 1;
	let longestStreak = 1;

	for (let i = 1; i < logs.length; i++) {
		const diff = differenceInCalendarDays(logs[i], logs[i - 1]);

		if (diff === 1) {
			currentStreak++;
			longestStreak = Math.max(longestStreak, currentStreak);
		} else if (diff > 1) {
			currentStreak = 1;
		}
	}

	// Check if streak continues today
	const today = startOfDay(new Date());
	const lastLog = logs[logs.length - 1];
	if (differenceInCalendarDays(today, lastLog) >= 2) currentStreak = 0;

	return { currentStreak, longestStreak };
};
