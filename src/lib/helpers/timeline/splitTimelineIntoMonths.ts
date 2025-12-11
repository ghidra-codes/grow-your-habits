import { parseISO } from "date-fns";
import type { TimelineEntry, DailyPeriodTimeline } from "@/types/statistic.types";

export const splitTimelineIntoMonths = (timeline: TimelineEntry[]): DailyPeriodTimeline => {
	const months: DailyPeriodTimeline = [];
	let currentMonth: TimelineEntry[] = [];

	let currentMonthNumber = parseISO(timeline[0].date).getMonth();

	for (let i = 0; i < timeline.length; i++) {
		const entry = timeline[i];
		const month = parseISO(entry.date).getMonth();

		if (month !== currentMonthNumber) {
			months.push(currentMonth);
			currentMonth = [];
			currentMonthNumber = month;
		}

		currentMonth.push(entry);
	}

	if (currentMonth.length > 0) {
		months.push(currentMonth);
	}

	return months;
};
