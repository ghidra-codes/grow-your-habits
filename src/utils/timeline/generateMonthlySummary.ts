import type { HabitWithRelations } from "@/types/habit.types";
import type { MonthlySummary } from "@/types/statistics.types";
import { addMonths, endOfMonth, getMonth, getYear, isAfter, startOfMonth } from "date-fns";

export const generateMonthlySummary = (habit: HabitWithRelations): MonthlySummary[] => {
	if (habit.frequency_type !== "monthly") return [];

	const target = habit.target_per_month ?? 0;
	const logs = (habit.logs ?? []).map((l) => new Date(l.log_date));

	const createdAt = new Date(habit.created_at);
	const today = new Date();

	let cursor = startOfMonth(createdAt);
	const result: MonthlySummary[] = [];

	while (!isAfter(cursor, today)) {
		const start = startOfMonth(cursor);
		const end = endOfMonth(cursor);

		const completed = logs.filter((l) => l >= start && l <= end).length;

		result.push({
			year: getYear(start),
			month: getMonth(start),
			start: start.toISOString().slice(0, 10),
			end: end.toISOString().slice(0, 10),
			completed,
			target,
			status: completed >= target ? "completed" : completed > 0 ? "on-track" : "behind",
		});

		cursor = addMonths(cursor, 1);
	}

	return result;
};
