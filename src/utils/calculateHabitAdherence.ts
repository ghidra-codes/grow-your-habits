import { startOfDay, differenceInDays, startOfWeek, startOfMonth, endOfMonth } from "date-fns";
import type { HabitAdherence, HabitWithRelations } from "@/types/habit.types";

export const calculateHabitAdherence = (
	habit: HabitWithRelations,
	scheduleWeekdays: number[]
): HabitAdherence => {
	const adherenceBoundary = startOfDay(new Date());
	const createdAt = startOfDay(new Date(habit.created_at));

	// CALCULATE ACTUAL LOGS

	const logsCount = (habit.logs ?? []).filter(
		(l) => startOfDay(new Date(l.log_date)).getTime() <= adherenceBoundary.getTime()
	).length;

	let expectedCount = 0;
	let period: HabitAdherence["period"] = "day";

	// CALCULATE EXPECTED LOGS BASED ON FREQUENCY TYPE

	// DAILY

	if (habit.frequency_type === "daily") {
		period = "day";
		expectedCount = Math.max(0, differenceInDays(adherenceBoundary, createdAt) + 1);
	}

	// WEEKLY

	if (habit.frequency_type === "weekly") {
		period = "week";
		const target = habit.target_per_week ?? 0;

		const weekStart = startOfWeek(adherenceBoundary, { weekStartsOn: 1 });

		const effectiveStart = startOfDay(new Date(Math.max(weekStart.getTime(), createdAt.getTime())));

		const daysActiveInPeriod = differenceInDays(adherenceBoundary, effectiveStart) + 1;

		if (daysActiveInPeriod > 0) {
			const progress = daysActiveInPeriod / 7;
			expectedCount = Math.ceil(progress * target);
		}
	}

	// MONTHLY

	if (habit.frequency_type === "monthly") {
		period = "month";
		const target = habit.target_per_month ?? 0;

		const monthStart = startOfMonth(adherenceBoundary);
		const monthEnd = endOfMonth(adherenceBoundary);
		const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;

		const effectiveStart = startOfDay(new Date(Math.max(monthStart.getTime(), createdAt.getTime())));

		const daysActiveInPeriod = differenceInDays(adherenceBoundary, effectiveStart) + 1;

		if (daysActiveInPeriod > 0) {
			const progress = daysActiveInPeriod / daysInMonth;
			expectedCount = Math.ceil(progress * target);
		}
	}

	// CUSTOM

	if (habit.frequency_type === "custom") {
		period = "day";

		let count = 0;
		const cursor = new Date(createdAt);

		while (cursor <= adherenceBoundary) {
			if (scheduleWeekdays.includes(cursor.getDay())) count++;
			cursor.setDate(cursor.getDate() + 1);
		}
		expectedCount = count;
	}

	// FINAL CALCULATIONS

	expectedCount = Math.max(0, expectedCount);

	const percentage = expectedCount === 0 ? 100 : Math.min(100, (logsCount / expectedCount) * 100);

	return {
		habitId: habit.id,
		expected: expectedCount,
		logCount: logsCount,
		period,
		onTrack: logsCount >= expectedCount,
		percentage,
		missed: Math.max(0, expectedCount - logsCount),
	};
};
