import type { TimelineEntry } from "@/types/statistic.types";
import { getISOWeek, getISOWeekYear, parseISO } from "date-fns";

export const splitIntoWeeks = (period: TimelineEntry[]): TimelineEntry[][] => {
	if (!period.length) return [];

	const weeks: TimelineEntry[][] = [];
	let current: TimelineEntry[] = [];

	let weekNum = getISOWeek(parseISO(period[0].date));
	let weekYear = getISOWeekYear(parseISO(period[0].date));

	period.forEach((entry) => {
		const date = parseISO(entry.date);
		const w = getISOWeek(date);
		const y = getISOWeekYear(date);

		if (w !== weekNum || y !== weekYear) {
			weeks.push(current);
			current = [];
			weekNum = w;
			weekYear = y;
		}

		current.push(entry);
	});

	if (current.length) weeks.push(current);

	return weeks;
};
