import type { HabitWithRelations } from "@/types/habit.types";
import type { TimelineEntry } from "@/types/statistics.types";
import { addDays, differenceInCalendarDays, format, startOfDay } from "date-fns";
import { parseLocalDate } from "./helpers/parseLocalDate";

export const generateDailyTimeline = (habit: HabitWithRelations): TimelineEntry[] => {
	const today = startOfDay(new Date());
	const createdAt = parseLocalDate(habit.created_at.slice(0, 10));

	const completedDates = new Set(
		(habit.logs ?? []).map((log) => startOfDay(parseLocalDate(log.log_date.slice(0, 10))).toISOString())
	);

	const timeline: TimelineEntry[] = [];
	const totalDays = differenceInCalendarDays(today, createdAt) + 1;

	for (let i = 0; i < totalDays; i++) {
		const day = addDays(createdAt, i);
		const key = startOfDay(day).toISOString();

		const status: TimelineEntry["status"] = completedDates.has(key) ? "completed" : "missed";

		timeline.push({
			date: format(day, "yyyy-MM-dd"),
			status,
		});
	}

	return timeline;
};
