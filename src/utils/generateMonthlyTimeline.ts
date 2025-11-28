import type { HabitWithRelations } from "@/types/habit.types";
import type { TimelineEntry } from "@/types/statistics.types";
import { addDays, differenceInCalendarDays, endOfMonth, format, startOfDay } from "date-fns";
import { parseLocalDate } from "./helpers/parseLocalDate";

export const generateMonthlyTimeline = (habit: HabitWithRelations): TimelineEntry[] => {
	const today = startOfDay(new Date());
	const createdAt = parseLocalDate(habit.created_at.slice(0, 10));

	// Start exactly at createdAt — NOT at startOfMonth
	const monthStart = createdAt;

	// Last day of the month containing today
	const monthEnd = endOfMonth(today);

	const completed = new Set(
		(habit.logs ?? []).map((log) => startOfDay(parseLocalDate(log.log_date.slice(0, 10))).toISOString())
	);

	const totalDays = differenceInCalendarDays(monthEnd, monthStart) + 1;
	const timeline: TimelineEntry[] = [];

	for (let i = 0; i < totalDays; i++) {
		const day = addDays(monthStart, i);
		const key = startOfDay(day).toISOString();

		let status: TimelineEntry["status"];

		if (day > today) {
			status = "unavailable";
		} else if (completed.has(key)) {
			status = "completed";
		} else {
			status = "missed";
		}

		timeline.push({
			date: format(day, "yyyy-MM-dd"),
			status,
		});
	}

	return timeline;
};
