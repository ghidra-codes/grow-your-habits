import type { AdherenceMap, HabitWithLogs, RecentAdherenceMap } from "@/types/habit.types";
import type { HabitRef, InsightContext } from "@/types/insight.types";
import type { StreakMap } from "@/types/statistic.types";
import { isWithinInterval, startOfDay, subDays } from "date-fns";

type BuildInsightContextArgs = {
	habits: HabitWithLogs[];
	adherenceMap: AdherenceMap;
	recentMap: RecentAdherenceMap;
	streakMap: StreakMap;
	weeklyGrowthChange: number;
	monthlyGrowthChange: number;
};

export const buildInsightContext = ({
	habits,
	adherenceMap,
	recentMap,
	streakMap,
	weeklyGrowthChange,
	monthlyGrowthChange,
}: BuildInsightContextArgs): InsightContext => {
	const today = startOfDay(new Date());

	// STRONGEST DAY

	const completions: number[] = Array(7).fill(0);

	for (const habit of habits) {
		for (const log of habit.logs ?? []) {
			const date = new Date(log.log_date);

			const weekday = date.getDay();
			const normalized = weekday === 0 ? 6 : weekday - 1;

			completions[normalized]++;
		}
	}

	const maxCompletions = Math.max(...completions);
	const strongestDayIndex = maxCompletions > 0 ? completions.indexOf(maxCompletions) : null;

	// STRONGEST & WEAKEST HABIT

	const adherenceList = habits.map((habit) => ({
		id: habit.id,
		name: habit.name,
		score: adherenceMap[habit.id]?.percentage ?? 0,
	}));

	let strongestHabit: HabitRef | null = null;
	let weakestHabit: HabitRef | null = null;

	if (adherenceList.length > 0) {
		let max = adherenceList[0];
		let min = adherenceList[0];

		for (const h of adherenceList) {
			if (h.score > max.score) max = h;
			if (h.score < min.score) min = h;
		}

		strongestHabit = { id: max.id, name: max.name };
		weakestHabit = { id: min.id, name: min.name };
	}

	// WEEKLY / MONTHLY TOTALS

	const last7 = subDays(today, 6);
	const last30 = subDays(today, 29);

	let weeklyTotal = 0;
	let monthlyTotal = 0;

	for (const habit of habits) {
		for (const log of habit.logs) {
			const date = startOfDay(new Date(log.log_date));

			if (isWithinInterval(date, { start: last7, end: today })) weeklyTotal++;
			if (isWithinInterval(date, { start: last30, end: today })) monthlyTotal++;
		}
	}

	// BEST STREAK

	let bestStreakHabit: (HabitRef & { longestStreak: number }) | null = null;
	for (const habit of habits) {
		const streak = streakMap[habit.id]?.longestStreak ?? 0;

		if (!bestStreakHabit || streak > bestStreakHabit.longestStreak) {
			if (streak > 0) bestStreakHabit = { id: habit.id, name: habit.name, longestStreak: streak };
		}
	}

	// MOST IMPROVED HABIT

	let mostImprovedHabit: (HabitRef & { improvement: number }) | null = null;
	for (const habit of habits) {
		const recent = recentMap[habit.id];
		const improvement = (recent?.last7 ?? 0) - (recent?.last30 ?? 0);

		if (!mostImprovedHabit || improvement > mostImprovedHabit.improvement) {
			if (improvement > 0) mostImprovedHabit = { id: habit.id, name: habit.name, improvement };
		}
	}

	// FINAL CONTEXT

	return {
		strongestDayIndex,
		strongestHabit,
		weakestHabit,
		weeklyTotal,
		monthlyTotal,
		weeklyGrowthChange,
		monthlyGrowthChange,
		bestStreakHabit,
		mostImprovedHabit,
	};
};
