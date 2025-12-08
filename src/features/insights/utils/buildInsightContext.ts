import { getDailyCompletionMap } from "@/lib/helpers/getDailyCompletionMap";
import type { AdherenceMap, HabitWithLogs, ShortTermAdherenceMap } from "@/types/habit.types";
import type { InsightContext } from "@/types/insights.types";
import type { StreakMap } from "@/types/statistics.types";
import { isWithinInterval, startOfDay, subDays } from "date-fns";

type BuildInsightContextArgs = {
	habits: HabitWithLogs[];
	adherenceMap: AdherenceMap;
	shortTermMap: ShortTermAdherenceMap;
	streakMap: StreakMap;
	weeklyGrowthChange: number;
	monthlyGrowthChange: number;
};

export const buildInsightContext = ({
	habits,
	adherenceMap,
	shortTermMap,
	streakMap,
	weeklyGrowthChange,
	monthlyGrowthChange,
}: BuildInsightContextArgs): InsightContext => {
	const today = startOfDay(new Date());

	const last7Start = subDays(today, 6);
	const last30Start = subDays(today, 29);

	// Completions by weekday
	const completionsByDay: Record<number, number> = {
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
	};

	for (const habit of habits) {
		const dailyMap = getDailyCompletionMap(habit);

		for (const [date, completed] of Object.entries(dailyMap)) {
			if (!completed) continue;

			const d = startOfDay(new Date(date));
			const weekday = d.getDay();
			const normalized = weekday === 0 ? 6 : weekday - 1;
			completionsByDay[normalized]++;
		}
	}

	// Strongest day
	const strongestDayEntry = Object.entries(completionsByDay).sort((a, b) => b[1] - a[1])[0];

	const strongestDayIndex =
		strongestDayEntry && strongestDayEntry[1] > 0 ? Number(strongestDayEntry[0]) : null;

	// Adherence-based strongest / weakest habits
	const adherenceList = habits.map((h) => ({
		id: h.id,
		name: h.name,
		adherence: adherenceMap[h.id]?.percentage ?? 0,
	}));

	const strongestHabit =
		adherenceList.length > 0 ? [...adherenceList].sort((a, b) => b.adherence - a.adherence)[0] : null;

	const weakestHabit =
		adherenceList.length > 0 ? [...adherenceList].sort((a, b) => a.adherence - b.adherence)[0] : null;

	// Weekly & Monthly totals
	let weeklyTotal = 0;
	let monthlyTotal = 0;

	for (const habit of habits) {
		for (const log of habit.logs) {
			const logDate = startOfDay(new Date(log.log_date));

			if (isWithinInterval(logDate, { start: last7Start, end: today })) weeklyTotal++;

			if (isWithinInterval(logDate, { start: last30Start, end: today })) monthlyTotal++;
		}
	}

	// Best streak habit
	let bestStreakHabit: InsightContext["bestStreakHabit"] = null;

	if (habits.length > 0) {
		const sorted = [...habits].sort(
			(a, b) => (streakMap[b.id]?.longestStreak ?? 0) - (streakMap[a.id]?.longestStreak ?? 0)
		);

		const top = sorted[0];
		const longest = streakMap[top.id]?.longestStreak ?? 0;

		if (longest > 0) {
			bestStreakHabit = {
				id: top.id,
				name: top.name,
				longestStreak: longest,
			};
		}
	}

	// Most improved habit (last 7 days vs last 30 days)
	let mostImprovedHabit: InsightContext["mostImprovedHabit"] = null;

	if (habits.length > 0) {
		const improvements = habits.map((h) => {
			const short = shortTermMap[h.id];
			const last7 = short?.last7 ?? 0;
			const last30 = short?.last30 ?? 0;

			return {
				id: h.id,
				name: h.name,
				improvement: last7 - last30,
			};
		});

		const top = [...improvements].sort((a, b) => b.improvement - a.improvement)[0];

		if (top && top.improvement > 0) mostImprovedHabit = top;
	}

	return {
		habits,
		adherenceMap,
		shortTermMap,
		streakMap,

		completionsByDay,
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
