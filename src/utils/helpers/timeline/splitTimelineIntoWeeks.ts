import { parseISO, getISOWeek, getISOWeekYear } from "date-fns";
import type { TimelineEntry, PeriodTimeline } from "@/types/statistics.types";

export const splitTimelineIntoWeeks = (timeline: TimelineEntry[]): PeriodTimeline => {
	const weeks: PeriodTimeline = [];
	let currentWeek: TimelineEntry[] = [];

	let currentWeekNumber = getISOWeek(parseISO(timeline[0].date));
	let currentWeekYear = getISOWeekYear(parseISO(timeline[0].date));

	for (let i = 0; i < timeline.length; i++) {
		const entry = timeline[i];
		const date = parseISO(entry.date);

		const week = getISOWeek(date);
		const weekYear = getISOWeekYear(date);

		if (week !== currentWeekNumber || weekYear !== currentWeekYear) {
			weeks.push(currentWeek);

			currentWeek = [];
			currentWeekNumber = week;
			currentWeekYear = weekYear;
		}

		currentWeek.push(entry);
	}

	if (currentWeek.length > 0) weeks.push(currentWeek);

	return weeks;
};
