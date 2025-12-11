import type { HabitWithLogs } from "@/types/habit.types";
import type { SummaryStatus, WeeklySummary } from "@/types/statistic.types";
import { addWeeks, endOfWeek, getISOWeek, isAfter, startOfWeek } from "date-fns";

export const generateWeeklySummary = (habit: HabitWithLogs, chartData?: boolean): WeeklySummary[] => {
	if (!chartData && habit.frequency_type !== "weekly") return [];

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

		const isPastWeek = today > end;

		let status: SummaryStatus;
		if (completed >= target) status = "completed";
		else if (isPastWeek) status = "missed";
		else status = "pending";

		result.push({
			number: getISOWeek(start),
			start: start.toISOString().slice(0, 10),
			end: end.toISOString().slice(0, 10),
			completed,
			target,
			status,
		});

		cursor = addWeeks(cursor, 1);
	}

	return result;
};
