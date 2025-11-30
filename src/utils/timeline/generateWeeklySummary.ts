import type { HabitWithRelations } from "@/types/habit.types";
import type { WeeklySummary } from "@/types/statistics.types";
import { addWeeks, endOfWeek, getISOWeek, getYear, isAfter, startOfWeek } from "date-fns";

export const generateWeeklySummary = (habit: HabitWithRelations): WeeklySummary[] => {
	if (habit.frequency_type !== "weekly") return [];

	const target = habit.target_per_week ?? 0;
	const logs = (habit.logs ?? []).map((l) => new Date(l.log_date));

	const createdAt = new Date(habit.created_at);
	const today = new Date();

	let cursor = startOfWeek(createdAt, { weekStartsOn: 1 });
	const result: WeeklySummary[] = [];

	while (!isAfter(cursor, today)) {
		const start = cursor;
		const end = endOfWeek(cursor, { weekStartsOn: 1 });

		const completed = logs.filter((l) => l >= start && l <= end).length;

		result.push({
			weekNumber: getISOWeek(start),
			year: getYear(start),
			start: start.toISOString().slice(0, 10),
			end: end.toISOString().slice(0, 10),
			completed,
			target,
			status: completed >= target ? "completed" : completed > 0 ? "on-track" : "behind",
		});

		cursor = addWeeks(cursor, 1);
	}

	return result;
};
