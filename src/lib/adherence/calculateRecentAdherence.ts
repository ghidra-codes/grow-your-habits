import { subDays, eachDayOfInterval, startOfDay } from "date-fns";
import type { HabitWithLogs } from "@/types/habit.types";
import { getEffectiveIntervalEnd } from "./getEffectiveIntervalEnd";
import { getDailyCompletionMap } from "../habits/getDailyCompletionMap";

/**
 * Calculates short-term adherence (last 7 and last 30 days) based on the habit's frequency.
 */
export const calculateRecentAdherence = (habit: HabitWithLogs) => {
	const frequency = habit.frequency_type;
	const dailyMap = getDailyCompletionMap(habit);

	const today = startOfDay(new Date());
	const createdAt = startOfDay(new Date(habit.created_at));
	const intervalEnd = getEffectiveIntervalEnd(habit, today);

	const calc = (daysInPeriod: number) => {
		const intervalStart = subDays(today, daysInPeriod - 1);
		const start = startOfDay(new Date(Math.max(intervalStart.getTime(), createdAt.getTime())));

		if (intervalEnd < start) return 100;

		const actualInterval = eachDayOfInterval({ start, end: intervalEnd });
		const daysActive = actualInterval.length;

		if (daysActive === 0) return 100;

		let completed = 0;
		let expectedOpportunities = 0;

		// DAILY
		if (frequency === "daily") {
			expectedOpportunities = daysActive;

			for (const day of actualInterval) {
				const key = day.toISOString().slice(0, 10);
				if (dailyMap[key] === 1) completed++;
			}
		}

		// WEEKLY / MONTHLY
		if (frequency === "weekly" || frequency === "monthly") {
			const target = frequency === "weekly" ? habit.target_per_week ?? 1 : habit.target_per_month ?? 1;

			expectedOpportunities = Math.min(target, daysActive);

			completed = actualInterval.filter((day) => {
				const key = day.toISOString().slice(0, 10);
				return dailyMap[key] === 1;
			}).length;

			if (expectedOpportunities === 0) return 100;
		}

		return Math.min(100, (completed / expectedOpportunities) * 100);
	};

	return {
		last7: calc(7),
		last30: calc(30),
	};
};
