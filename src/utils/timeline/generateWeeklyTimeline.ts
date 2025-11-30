import type { HabitWithRelations } from "@/types/habit.types";
import type { TimelineEntry } from "@/types/statistics.types";
import { addDays, differenceInCalendarDays, endOfWeek, format, startOfDay } from "date-fns";
import { getEarliestAllowedStart } from "../helpers/timeline/getEarliestAllowedStart";
import { parseLocalDate } from "../helpers/parseLocalDate";

export const generateWeeklyTimeline = (habit: HabitWithRelations): TimelineEntry[] => {
	const today = startOfDay(new Date());
	const createdAt = parseLocalDate(habit.created_at.slice(0, 10));

	const startBoundary = getEarliestAllowedStart(createdAt, today);
	const endBoundary = endOfWeek(today, { weekStartsOn: 1 });

	const completedDates = new Set(
		(habit.logs ?? []).map((log) => startOfDay(parseLocalDate(log.log_date.slice(0, 10))).toISOString())
	);

	const totalDays = differenceInCalendarDays(endBoundary, startBoundary) + 1;
	const timeline: TimelineEntry[] = [];

	for (let i = 0; i < totalDays; i++) {
		const day = addDays(startBoundary, i);
		const key = startOfDay(day).toISOString();

		let status: TimelineEntry["status"];

		if (day > today) {
			status = "unavailable";
		} else if (completedDates.has(key)) {
			status = "completed";
		} else if (differenceInCalendarDays(today, day) === 0) {
			status = "pending";
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
