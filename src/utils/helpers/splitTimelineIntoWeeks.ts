import type { TimelineEntry, PeriodTimeline } from "@/types/statistics.types";

export const splitTimelineIntoWeeks = (timeline: TimelineEntry[]): PeriodTimeline => {
	const weeks: PeriodTimeline = [];
	let currentWeek: TimelineEntry[] = [];

	for (let i = 0; i < timeline.length; i++) {
		currentWeek.push(timeline[i]);

		if (currentWeek.length === 7) {
			// Only push weeks that contain at least one completed or missed day
			const hasActivity = currentWeek.some(
				(day) => day.status === "completed" || day.status === "missed"
			);

			if (hasActivity) weeks.push(currentWeek);

			currentWeek = [];
		}
	}

	return weeks;
};
