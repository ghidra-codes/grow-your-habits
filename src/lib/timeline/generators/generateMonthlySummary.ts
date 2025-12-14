import type { HabitWithLogs } from "@/types/habit.types";
import type { MonthlySummary, SummaryStatus } from "@/types/statistic.types";
import {
	addMonths,
	differenceInDays,
	endOfMonth,
	getMonth,
	getYear,
	startOfDay,
	startOfMonth,
} from "date-fns";

export const generateMonthlySummary = (habit: HabitWithLogs): MonthlySummary[] => {
	if (habit.frequency_type !== "monthly") return [];

	const target = habit.target_per_month ?? 0;
	const logs = (habit.logs ?? []).map((l) => startOfDay(new Date(l.log_date)));

	const createdAt = startOfDay(new Date(habit.created_at));
	const today = startOfDay(new Date());

	let cursor = startOfMonth(createdAt);
	const result: MonthlySummary[] = [];

	while (cursor <= today) {
		const start = startOfMonth(cursor);
		const end = endOfMonth(cursor);
		const nextMonthStart = addMonths(start, 1);

		const completed = logs.filter((l) => l >= start && l <= end).length;

		const effectiveStart = createdAt > start ? createdAt : start;
		const daysAvailable = Math.max(0, differenceInDays(end, effectiveStart) + 1);
		const daysInMonth = differenceInDays(end, start) + 1;

		const progressRatio = Math.min(1, daysAvailable / daysInMonth);
		const effectiveTarget = Math.ceil(target * progressRatio);

		let status: SummaryStatus;
		if (completed >= effectiveTarget) status = "completed";
		else if (today >= nextMonthStart) status = "missed";
		else status = "pending";

		result.push({
			month: getMonth(start) + 1,
			year: getYear(start),
			completed,
			target: effectiveTarget,
			status,
		});

		cursor = addMonths(cursor, 1);
	}

	return result;
};
