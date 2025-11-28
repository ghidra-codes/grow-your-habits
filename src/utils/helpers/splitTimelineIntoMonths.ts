import { parseISO } from "date-fns";
import type { TimelineEntry, PeriodTimeline } from "@/types/statistics.types";

export const splitTimelineIntoMonths = (timeline: TimelineEntry[]): PeriodTimeline => {
	const months: PeriodTimeline = [];
	let currentMonth: TimelineEntry[] = [];

	let currentMonthNumber = parseISO(timeline[0].date).getMonth();

	for (let i = 0; i < timeline.length; i++) {
		const day = timeline[i];
		const month = parseISO(day.date).getMonth();

		if (month !== currentMonthNumber) {
			const hasActivity = currentMonth.some(
				(day) => day.status === "completed" || day.status === "missed"
			);

			if (hasActivity) months.push(currentMonth);

			currentMonth = [];
			currentMonthNumber = month;
		}

		currentMonth.push(day);
	}

	if (currentMonth.length > 0) {
		const hasActivity = currentMonth.some((day) => day.status === "completed" || day.status === "missed");

		if (hasActivity) months.push(currentMonth);
	}

	return months;
};
