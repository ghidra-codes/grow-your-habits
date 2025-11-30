import { startOfMonth, endOfMonth, addMonths } from "date-fns";
import type { HabitWithRelations } from "@/types/habit.types";

export const calculateMonthlyStreak = (habit: HabitWithRelations) => {
	const target = habit.target_per_month ?? 0;
	const logs = habit.logs.map((l) => new Date(l.log_date));

	if (target === 0) return { currentStreak: 0, longestStreak: 0 };

	const created = new Date(habit.created_at);
	const today = new Date();

	let cursor = startOfMonth(created);

	let streak = 0;
	let longest = 0;

	while (cursor <= today) {
		const start = startOfMonth(cursor);
		const end = endOfMonth(cursor);

		const logsInMonth = logs.filter((l) => l >= start && l <= end).length;

		if (logsInMonth >= target) {
			streak++;
			longest = Math.max(longest, streak);
		} else {
			streak = 0;
		}

		cursor = addMonths(cursor, 1);
	}

	return { currentStreak: streak, longestStreak: longest };
};
