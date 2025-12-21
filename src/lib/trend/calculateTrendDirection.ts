import type { FrequencyType, HabitWithLogs } from "@/types/habit.types";
import type { TrendDirection } from "@/types/statistic.types";
import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import { getDailyCompletionMap } from "../habits";

// Min percentage-point change required to classify a trend as improving or declining
const TREND_THRESHOLD = 5;

// Expected completions per day (normalized for trend comparison)
const getExpectedPerDay = (frequency: FrequencyType, habit: HabitWithLogs): number => {
	const map: Record<FrequencyType, number> = {
		daily: 1,
		weekly: (habit.target_per_week ?? 0) / 7,
		monthly: (habit.target_per_month ?? 0) / 30,
	};
	return map[frequency] ?? 1;
};

// Calculates adherence percentage for a set of days
const getAdherencePercent = (
	days: Date[],
	expectedPerDay: number,
	completionMap: Record<string, 1 | 0>
): number => {
	if (expectedPerDay <= 0) return 0;

	let completed = 0;
	let expected = 0;

	for (const day of days) {
		const key = format(day, "yyyy-MM-dd");
		if (completionMap[key] === 1) completed += 1;
		expected += expectedPerDay;
	}

	if (expected <= 0) return 0;

	return Math.min((completed / expected) * 100, 100);
};

export const calculateTrendDirection = (habit: HabitWithLogs, frequency: FrequencyType): TrendDirection => {
	const completionMap = getDailyCompletionMap(habit);

	const today = startOfDay(new Date());
	const createdAt = startOfDay(new Date(habit.created_at));

	const last7Start = subDays(today, 6);
	const prev7Start = subDays(today, 13);

	const expectedPerDay = getExpectedPerDay(frequency, habit);
	const existedBeforePrevWindow = createdAt <= prev7Start;

	let recent = 0;
	let previous = 0;

	if (existedBeforePrevWindow) {
		// NORMAL 7-DAY COMPARISON
		const recentDays = eachDayOfInterval({ start: last7Start, end: today });
		const prevDays = eachDayOfInterval({
			start: prev7Start,
			end: subDays(today, 7),
		});

		recent = getAdherencePercent(recentDays, expectedPerDay, completionMap);
		previous = getAdherencePercent(prevDays, expectedPerDay, completionMap);
	} else {
		// HABIT CREATED WITHIN LAST 14 DAYS - COMPARE ALL DAYS SINCE CREATION
		const daysSinceCreation = eachDayOfInterval({ start: createdAt, end: today });

		if (daysSinceCreation.length < 2) return "stable";

		const mid = Math.floor(daysSinceCreation.length / 2);
		const earlierDays = daysSinceCreation.slice(0, mid);
		const recentDays = daysSinceCreation.slice(mid);

		previous = getAdherencePercent(earlierDays, expectedPerDay, completionMap);
		recent = getAdherencePercent(recentDays, expectedPerDay, completionMap);
	}

	// HIGH CONISTENCY OVERRIDE
	if (recent >= 85 && previous >= 85) return "strong";

	const diff = recent - previous;

	if (diff >= TREND_THRESHOLD) return "improving";
	if (diff <= -TREND_THRESHOLD) return "declining";

	return "stable";
};
