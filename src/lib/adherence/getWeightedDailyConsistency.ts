import type { HabitWithLogs } from "@/types/habit.types";
import { differenceInDays, eachDayOfInterval, startOfDay } from "date-fns";
import { getDailyCompletionMap } from "../habits/getDailyCompletionMap";

export const getWeightedDailyConsistency = (habit: HabitWithLogs) => {
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

		// PAST DAYS
		if (day < today) {
			weightedExpected += weight;
			if (completed) weightedCompleted += weight;
			continue;
		}

		// TODAY
		if (day.getTime() === today.getTime() && completed) {
			weightedExpected += weight;
			weightedCompleted += weight;
		}
	}

	if (weightedExpected === 0) return 0;

	return Math.round((weightedCompleted / weightedExpected) * 100);
};
