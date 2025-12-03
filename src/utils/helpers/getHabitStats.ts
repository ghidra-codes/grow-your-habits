import type { AdherenceMap, HabitWithRelations, ShortTermAdherenceMap } from "@/types/habit.types";
import type {
	TimelineMap,
	StreakMap,
	TimelineModesMap,
	DailyPeriodTimeline,
	WeeklySummaryTimeline,
	MonthlySummaryTimeline,
} from "@/types/statistics.types";
import { calculateTrendDirection } from "../calculateTrendDirection";

interface GetHabitStatsArgs {
	habit: HabitWithRelations;
	habitFrequency: "daily" | "weekly" | "monthly" | "custom";
	adherenceMap: AdherenceMap;
	streakMap: StreakMap;
	timelineMap: TimelineMap;
	timelineModes: TimelineModesMap;
	shortTermAdherenceMap: ShortTermAdherenceMap;
}

export const getHabitStats = ({
	habit,
	habitFrequency,
	adherenceMap,
	streakMap,
	timelineMap,
	timelineModes,
	shortTermAdherenceMap,
}: GetHabitStatsArgs) => {
	const adherence = adherenceMap[habit.id];
	const streak = streakMap[habit.id];
	const mode = timelineModes[habit.id] ?? "weekly";
	const shortTermAdherence = shortTermAdherenceMap[habit.id];

	let timeline: DailyPeriodTimeline | WeeklySummaryTimeline | MonthlySummaryTimeline | undefined;

	switch (habitFrequency) {
		case "daily":
			timeline = timelineMap.daily[habit.id];
			break;
		case "weekly":
			timeline = timelineMap.weekly[habit.id];
			break;
		case "monthly":
			timeline = timelineMap.monthly[habit.id];
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
			trend: calculateTrendDirection(habit),
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
			trend: calculateTrendDirection(habit),
		};
	}

	// WEEKLY OR MONTHLY TIMELINE
	const single = timeline.length <= 7;
	const trend = calculateTrendDirection(habit);

	return {
		adherence,
		shortTermAdherence,
		currentStreak: streak.currentStreak,
		longestStreak: streak.longestStreak,
		mode,
		isSinglePeriod: single,
		isCompact: false,
		trend,
	};
};
