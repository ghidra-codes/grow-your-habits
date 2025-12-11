import type { HabitWithLogs } from "@/types/habit.types";
import type { TimelineEntry } from "@/types/statistic.types";
import { addDays, differenceInCalendarDays, format, startOfDay } from "date-fns";
import { getEarliestAllowedStart } from "../helpers/timeline/getEarliestAllowedStart";
import { parseLocalDate } from "../helpers/parseLocalDate";

export const generateWeeklyTimeline = (habit: HabitWithLogs): TimelineEntry[] => {
	const today = startOfDay(new Date());
	const createdAt = parseLocalDate(habit.created_at.slice(0, 10));

	const startBoundary = getEarliestAllowedStart(createdAt, today);

	const completedDates = new Set(
		(habit.logs ?? []).map((log) =>
			format(startOfDay(parseLocalDate(log.log_date.slice(0, 10))), "yyyy-MM-dd")
		)
	);

	const totalDays = differenceInCalendarDays(today, startBoundary) + 1;
	const timeline: TimelineEntry[] = [];

	for (let i = 0; i < totalDays; i++) {
		const day = addDays(startBoundary, i);
		const key = format(startOfDay(day), "yyyy-MM-dd");

		let status: TimelineEntry["status"];

		if (completedDates.has(key)) {
			status = "completed";
		} else if (differenceInCalendarDays(today, day) === 0) {
			status = "pending";
		} else if (day < createdAt) {
			status = "unavailable";
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
