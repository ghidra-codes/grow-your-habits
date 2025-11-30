import { startOfWeek, endOfWeek } from "date-fns";
import type { HabitWithRelations } from "@/types/habit.types";

export const calculateWeeklyStreak = (habit: HabitWithRelations) => {
	const target = habit.target_per_week ?? 0;
	const logs = habit.logs.map((l) => new Date(l.log_date));

	if (target === 0) return { currentStreak: 0, longestStreak: 0 };

	const created = new Date(habit.created_at);
	const today = new Date();

	let cursor = startOfWeek(created, { weekStartsOn: 1 });

	let streak = 0;
	let longest = 0;

	while (cursor <= today) {
		const start = cursor;
		const end = endOfWeek(cursor, { weekStartsOn: 1 });

		const logsInWeek = logs.filter((l) => l >= start && l <= end).length;

		if (logsInWeek >= target) {
			streak++;
			longest = Math.max(longest, streak);
		} else {
			streak = 0;
		}

		cursor = new Date(cursor);
		cursor.setDate(cursor.getDate() + 7);
	}

	return { currentStreak: streak, longestStreak: longest };
};
