import type { AdherenceMap, ShortTermAdherenceMap } from "@/types/habit.types";
import type {
	TimelineMap,
	StreakMap,
	TimelineModesMap,
	DailyPeriodTimeline,
	WeeklySummaryTimeline,
	MonthlySummaryTimeline,
} from "@/types/statistics.types";

interface GetHabitStatsArgs {
	habitId: string;
	habitFrequency: "daily" | "weekly" | "monthly" | "custom";
	adherenceMap: AdherenceMap;
	streakMap: StreakMap;
	timelineMap: TimelineMap;
	timelineModes: TimelineModesMap;
	shortTermAdherenceMap: ShortTermAdherenceMap;
}

export const getHabitStats = ({
	habitId,
	habitFrequency,
	adherenceMap,
	streakMap,
	timelineMap,
	timelineModes,
	shortTermAdherenceMap,
}: GetHabitStatsArgs) => {
	const adherence = adherenceMap[habitId];
	const streak = streakMap[habitId];
	const mode = timelineModes[habitId] ?? "weekly";
	const shortTermAdherence = shortTermAdherenceMap[habitId];

	let timeline: DailyPeriodTimeline | WeeklySummaryTimeline | MonthlySummaryTimeline | undefined;

	switch (habitFrequency) {
		case "daily":
			timeline = timelineMap.daily[habitId];
			break;
		case "weekly":
			timeline = timelineMap.weekly[habitId];
			break;
		case "monthly":
			timeline = timelineMap.monthly[habitId];
			break;
		default:
			timeline = undefined;
	}

	// CUSTOM OR MISSING TIMELINE
	if (!timeline) {
		return {
			adherence,
			shortTermAdherence,
			currentStreak: streak.currentStreak,
			longestStreak: streak.longestStreak,
			mode,
			isSinglePeriod: false,
			isCompact: false,
		};
	}

	// DAILY TIMELINE
	if (Array.isArray(timeline[0])) {
		const periods = timeline as DailyPeriodTimeline;

		const single = periods.length === 1;
		const compact = single && periods[0].length > 7 && mode === "monthly";

		return {
			adherence,
			shortTermAdherence,
			currentStreak: streak.currentStreak,
			longestStreak: streak.longestStreak,
			mode,
			isSinglePeriod: single,
			isCompact: compact,
		};
	}

	// WEEKLY OR MONTHLY TIMELINE
	const single = timeline.length <= 7;

	return {
		adherence,
		shortTermAdherence,
		currentStreak: streak.currentStreak,
		longestStreak: streak.longestStreak,
		mode,
		isSinglePeriod: single,
		isCompact: false,
	};
};
