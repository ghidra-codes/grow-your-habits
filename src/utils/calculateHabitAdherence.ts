import { differenceInDays, differenceInMonths } from "date-fns";
import type { HabitAdherence, HabitWithLogs } from "@/types/habit.types";

export const calculateHabitAdherence = (
	habit: HabitWithLogs,
	allLogs: { id: string; log_date: string }[],
	scheduleWeekdays: number[]
): HabitAdherence => {
	const today = new Date();
	const createdAt = new Date(habit.created_at);

	const totalLogs = allLogs.length;

	let expected = 0;

	switch (habit.frequency_type) {
		case "daily": {
			expected = Math.max(1, differenceInDays(today, createdAt) + 1);
			break;
		}

		case "weekly": {
			const days = differenceInDays(today, createdAt) + 1;
			const weeks = Math.ceil(days / 7);
			expected = weeks * (habit.target_per_week || 0);
			break;
		}

		case "monthly": {
			const months = Math.max(1, differenceInMonths(today, createdAt) + 1);
			expected = months * (habit.target_per_month || 0);
			break;
		}

		case "custom": {
			expected = countScheduledDays(createdAt, today, scheduleWeekdays);
			break;
		}
	}

	const actual = totalLogs;

	return {
		habitId: habit.id,
		expected,
		actual,
		period: getPeriod(habit.frequency_type),
		onTrack: actual >= expected,
		percentage: expected === 0 ? 100 : Math.min(100, (actual / expected) * 100),
		missed: Math.max(0, expected - actual),
	};
};

const countScheduledDays = (from: Date, to: Date, schedule: number[]) => {
	let count = 0;
	const cur = new Date(from);

	while (cur <= to) {
		if (schedule.includes(cur.getDay())) count++;
		cur.setDate(cur.getDate() + 1);
	}

	return count;
};

const getPeriod = (frequencyType: string) => {
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
