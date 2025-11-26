import { differenceInDays, differenceInMonths, startOfDay } from "date-fns";
import type { FrequencyType, HabitAdherence, HabitWithRelations } from "@/types/habit.types";

export const calculateHabitAdherence = (
	habit: HabitWithRelations,
	logCount: number,
	scheduleWeekdays: number[]
): HabitAdherence => {
	const today = startOfDay(new Date());
	const createdAt = startOfDay(new Date(habit.created_at));

	let expected = 0;

	switch (habit.frequency_type) {
		case "daily": {
			expected = differenceInDays(today, createdAt) + 1;
			break;
		}

		case "weekly": {
			const totalDays = differenceInDays(today, createdAt) + 1;
			const weeks = Math.ceil(totalDays / 7);
			expected = weeks * (habit.target_per_week || 0);
			break;
		}

		case "monthly": {
			const months = differenceInMonths(today, createdAt) + 1;
			expected = months * (habit.target_per_month || 0);
			break;
		}

		case "custom": {
			expected = countScheduledDays(createdAt, today, scheduleWeekdays);
			break;
		}
	}

	return {
		habitId: habit.id,
		expected,
		logCount,
		period: getPeriod(habit.frequency_type),
		onTrack: logCount >= expected,
		percentage: expected === 0 ? 100 : Math.min(100, (logCount / expected) * 100),
		missed: Math.max(0, expected - logCount),
	};
};

const countScheduledDays = (from: Date, to: Date, scheduledWeekdays: number[]) => {
	let count = 0;
	const current = new Date(from);

	while (current <= to) {
		if (scheduledWeekdays.includes(current.getDay())) {
			count++;
		}
		current.setDate(current.getDate() + 1);
	}

	return count;
};

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
