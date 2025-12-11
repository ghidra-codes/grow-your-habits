import type { HabitWithLogs } from "@/types/habit.types";
import type { MonthlySummary } from "@/types/statistic.types";
import { addMonths, endOfMonth, getMonth, getYear, isAfter, startOfMonth } from "date-fns";

export const generateMonthlySummary = (habit: HabitWithLogs): MonthlySummary[] => {
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

		const isPastMonth = today > end;

		let status: "completed" | "missed" | "pending";
		if (completed >= target) status = "completed";
		else if (isPastMonth) status = "missed";
		else status = "pending";

		result.push({
			month: getMonth(start) + 1,
			year: getYear(start),
			completed,
			target,
			status,
		});

		cursor = addMonths(cursor, 1);
	}

	return result;
};
