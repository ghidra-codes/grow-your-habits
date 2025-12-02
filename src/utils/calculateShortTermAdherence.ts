import { subDays, eachDayOfInterval, startOfDay } from "date-fns";
import { getDailyCompletionMap } from "./helpers/getDailyCompletionMap";
import type { HabitWithRelations } from "@/types/habit.types";

/**
 * Calculates short-term adherence (last 7 and last 30 days) based on the habit's frequency.
 */
export const calculateShortTermAdherence = (habit: HabitWithRelations) => {
	const dailyMap = getDailyCompletionMap(habit);

	const today = startOfDay(new Date());
	const createdAt = startOfDay(new Date(habit.created_at));

	const calc = (daysInPeriod: number) => {
		const intervalStart = subDays(today, daysInPeriod - 1);
		const start = startOfDay(new Date(Math.max(intervalStart.getTime(), createdAt.getTime())));

		const actualInterval = eachDayOfInterval({
			start,
			end: today,
		});

		const daysActive = actualInterval.length;

		if (daysActive === 0) return 100;

		let completed = 0;
		let expectedOpportunities = 0;

		// DAILY

		if (habit.frequency_type === "daily") {
			expectedOpportunities = daysActive;

			for (const day of actualInterval) {
				const key = day.toISOString().slice(0, 10);
				if ((dailyMap[key] ?? 0) === 1) completed++;
			}
		}

		// WEEKLY/MONTHLY
		if (habit.frequency_type === "weekly" || habit.frequency_type === "monthly") {
			const target =
				habit.frequency_type === "weekly" ? habit.target_per_week ?? 1 : habit.target_per_month ?? 1;

			const totalDaysInCycle = habit.frequency_type === "weekly" ? 7 : 30;

			const progressRatio = daysActive / totalDaysInCycle;

			expectedOpportunities = Math.ceil(progressRatio * target);

			const logsInPeriod = (habit.logs ?? []).filter(
				(l) =>
					startOfDay(new Date(l.log_date)).getTime() >= start.getTime() &&
					startOfDay(new Date(l.log_date)).getTime() <= today.getTime()
			).length;

			completed = logsInPeriod;
			expectedOpportunities = Math.max(1, expectedOpportunities);
		}

		// CUSTOM FREQUENCY LOGIC (Placeholder)
		if (habit.frequency_type === "custom") {
			expectedOpportunities = 2;
			completed = 1;
		}

		expectedOpportunities = Math.max(expectedOpportunities, 1);

		return Math.min(100, (completed / expectedOpportunities) * 100);
	};

	return {
		last7: calc(7),
		last30: calc(30),
	};
};
