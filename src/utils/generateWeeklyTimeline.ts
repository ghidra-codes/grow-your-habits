import type { HabitWithRelations } from "@/types/habit.types";
import type { TimelineEntry } from "@/types/statistics.types";
import { addDays, differenceInCalendarDays, format, startOfDay } from "date-fns";
import { parseLocalDate } from "./helpers/parseLocalDate";
import { getMonday, getSunday } from "./helpers/getWeekStartOrEnd";

export const generateWeeklyTimeline = (habit: HabitWithRelations): TimelineEntry[] => {
	const today = startOfDay(new Date());
	const createdAt = parseLocalDate(habit.created_at.slice(0, 10));
	const earliestAllowed = startOfDay(addDays(today, -365));

	const startBoundary = getMonday(createdAt > earliestAllowed ? createdAt : earliestAllowed);
	const endBoundary = getSunday(today);

	const completedDates = new Set(
		(habit.logs ?? []).map((log) => startOfDay(parseLocalDate(log.log_date.slice(0, 10))).toISOString())
	);

	const timeline: TimelineEntry[] = [];
	const totalDays = differenceInCalendarDays(endBoundary, startBoundary) + 1;

	for (let i = 0; i < totalDays; i++) {
		const day = addDays(startBoundary, i);
		const key = startOfDay(day).toISOString();

		let status: TimelineEntry["status"];

		if (day < createdAt) {
			status = "unavailable";
		} else if (day > today) {
			status = "unavailable";
		} else if (completedDates.has(key)) {
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
