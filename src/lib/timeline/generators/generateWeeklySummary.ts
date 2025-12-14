import type { HabitWithLogs } from "@/types/habit.types";
import type { SummaryStatus, WeeklySummary } from "@/types/statistic.types";
import { addWeeks, differenceInDays, endOfWeek, getISOWeek, startOfDay, startOfWeek } from "date-fns";

export const generateWeeklySummary = (habit: HabitWithLogs, chartData?: boolean): WeeklySummary[] => {
	if (!chartData && habit.frequency_type !== "weekly") return [];

	const target = habit.target_per_week ?? 0;
	const logs = (habit.logs ?? []).map((l) => startOfDay(new Date(l.log_date)));

	const createdAt = startOfDay(new Date(habit.created_at));
	const today = startOfDay(new Date());

	let cursor = startOfWeek(createdAt, { weekStartsOn: 1 });
	const result: WeeklySummary[] = [];

	while (cursor <= today) {
		const start = cursor;
		const end = endOfWeek(cursor, { weekStartsOn: 1 });
		const nextWeekStart = addWeeks(start, 1);

		const completed = logs.filter((l) => l >= start && l <= end).length;

		const effectiveStart = createdAt > start ? createdAt : start;
		const daysAvailable = Math.max(0, differenceInDays(end, effectiveStart) + 1);
		const progressRatio = Math.min(1, daysAvailable / 7);
		const effectiveTarget = Math.ceil(target * progressRatio);

		let status: SummaryStatus;
		if (completed >= effectiveTarget) status = "completed";
		else if (today >= nextWeekStart) status = "missed";
		else status = "pending";

		result.push({
			number: getISOWeek(start),
			start: start.toISOString().slice(0, 10),
			end: end.toISOString().slice(0, 10),
			completed,
			target: effectiveTarget,
			status,
		});

		cursor = addWeeks(cursor, 1);
	}

	return result;
};
