import { differenceInDays, eachDayOfInterval, getDaysInMonth, startOfDay } from "date-fns";
import type { HabitWithLogs } from "@/types/habit.types";
import { getDailyCompletionMap } from "./getDailyCompletionMap";

/**
 * Weighted lifetime adherence:
 * - Last 7 days     → weight 1.0
 * - Last 30 days    → weight 0.7
 * - Older           → weight 0.25
 *
 * This keeps lifetime adherence accurate but forgiving.
 */
export const getWeightedLifetimeAdherence = (habit: HabitWithLogs) => {
	const dailyMap = getDailyCompletionMap(habit);

	const today = startOfDay(new Date());
	const createdAt = startOfDay(new Date(habit.created_at));

	let weightedCompleted = 0;
	let weightedExpected = 0;

	const weights = {
		recent: 1.0,
		month: 0.7,
		old: 0.25,
	};

	const allDays = eachDayOfInterval({
		start: createdAt,
		end: today,
	});

	for (const day of allDays) {
		const dayKey = day.toISOString().slice(0, 10);
		const completed = dailyMap[dayKey] === 1;
		const age = differenceInDays(today, day);

		const weight = age <= 7 ? weights.recent : age <= 30 ? weights.month : weights.old;

		let expected = 0;

		// DAILY
		if (habit.frequency_type === "daily") {
			expected = 1;
		}

		// WEEKLY
		if (habit.frequency_type === "weekly") {
			const target = habit.target_per_week ?? 1;
			expected = target / 7;
		}

		// MONTHLY
		if (habit.frequency_type === "monthly") {
			const target = habit.target_per_month ?? 1;
			const daysInMonth = getDaysInMonth(day);
			expected = target / daysInMonth;
		}

		weightedExpected += expected * weight;
		if (completed) weightedCompleted += 1 * weight;
	}

	if (weightedExpected === 0) return 100;

	const percentage = (weightedCompleted / weightedExpected) * 100;
	return Math.min(100, Math.max(0, percentage));
};
