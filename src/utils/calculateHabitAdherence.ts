import { differenceInDays, differenceInMonths, startOfDay } from "date-fns";
import type { FrequencyType, HabitAdherence, HabitWithRelations } from "@/types/habit.types";

export const calculateHabitAdherence = (
	habit: HabitWithRelations,
	logCount: number,
	scheduleWeekdays: number[]
): HabitAdherence => {
	const today = startOfDay(new Date());
	const yesterday = startOfDay(new Date(today.getTime() - 24 * 60 * 60 * 1000));
	const createdAt = startOfDay(new Date(habit.created_at));

	const countScheduledDays = (from: Date, to: Date, scheduledWeekdays: number[]) => {
		if (to < from) return 0;

		let count = 0;
		const current = new Date(from);

		while (current <= to) {
			if (scheduledWeekdays.includes(current.getDay())) count++;
			current.setDate(current.getDate() + 1);
		}

		return count;
	};

	const computeExpectedUpTo = (to: Date) => {
		if (to < createdAt) return 0;

		switch (habit.frequency_type) {
			case "daily":
				return differenceInDays(to, createdAt) + 1;

			case "weekly": {
				const days = differenceInDays(to, createdAt) + 1;
				const weeks = Math.ceil(days / 7);
				return weeks * (habit.target_per_week || 0);
			}

			case "monthly": {
				const months = differenceInMonths(to, createdAt) + 1;
				return months * (habit.target_per_month || 0);
			}

			case "custom":
				return countScheduledDays(createdAt, to, scheduleWeekdays);

			default:
				return 0;
		}
	};

	const expected = computeExpectedUpTo(today);
	const expectedPast = computeExpectedUpTo(yesterday);

	const logCountPast = (habit.logs ?? []).filter(
		(log) => startOfDay(new Date(log.log_date)) < today
	).length;

	return {
		habitId: habit.id,
		expected,
		logCount,
		period: getPeriod(habit.frequency_type),
		onTrack: logCountPast >= expectedPast,
		percentage: expected === 0 ? 100 : Math.min(100, (logCount / expected) * 100),
		missed: Math.max(0, expectedPast - logCountPast),
	};
};

// Helper
const getPeriod = (frequencyType: FrequencyType): HabitAdherence["period"] => {
	switch (frequencyType) {
		case "daily":
			return "day";
		case "weekly":
			return "week";
		case "monthly":
			return "month";
		default:
			return "day";
	}
};
