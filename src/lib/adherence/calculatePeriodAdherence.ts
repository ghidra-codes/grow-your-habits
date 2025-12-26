import type { HabitAdherence, HabitWithLogs } from "@/types/habit.types";
import { differenceInDays, endOfMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { generateCurrentPeriod } from "../dates";
import { generateMonthlySummary, generateWeeklySummary } from "../timeline";
import { getWeightedPeriodAdherence } from "./getWeightedPeriodAdherence";

/**
 * Adherence philosophy:
 * - Past units are evaluated
 * - Current unit can help but never hurt
 * - Recent behavior matters more than old
 * - Adherence reflects consistency, not effort
 */

/**
 * Calculates adherence for weekly or monthly habits.
 */
export const calculatePeriodAdherence = (habit: HabitWithLogs): HabitAdherence => {
	if (habit.frequency_type === "daily") {
		throw new Error("calculatePeriodAdherence called for daily habit");
	}

	const today = startOfDay(new Date());
	const createdAt = startOfDay(new Date(habit.created_at));

	const { period } = generateCurrentPeriod(habit);
	const doneSoFar = period.filter((d) => d.status === "completed").length;

	let expected = 0;

	if (habit.frequency_type === "weekly") {
		const target = habit.target_per_week ?? 0;

		const weekStart = startOfWeek(today, { weekStartsOn: 1 });
		const effectiveStart = createdAt > weekStart ? createdAt : weekStart;

		const daysPassed = differenceInDays(today, effectiveStart) + 1;
		const progress = Math.min(1, daysPassed / 7);

		expected = Math.ceil(progress * target);
	}

	if (habit.frequency_type === "monthly") {
		const target = habit.target_per_month ?? 0;

		const monthStart = startOfMonth(today);
		const monthEnd = endOfMonth(today);
		const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;

		const effectiveStart = createdAt > monthStart ? createdAt : monthStart;
		const daysPassed = differenceInDays(today, effectiveStart) + 1;
		const progress = Math.min(1, daysPassed / daysInMonth);

		expected = Math.ceil(progress * target);
	}

	let missed = 0;
	let percentage = 0;

	if (habit.frequency_type === "weekly") {
		const summaries = generateWeeklySummary(habit);

		missed = summaries
			.filter((w) => w.status === "missed")
			.reduce((sum, w) => sum + Math.max(0, w.target - w.completed), 0);

		percentage = getWeightedPeriodAdherence(summaries);
	}

	if (habit.frequency_type === "monthly") {
		const summaries = generateMonthlySummary(habit);

		missed = summaries
			.filter((m) => m.status === "missed")
			.reduce((sum, m) => sum + Math.max(0, m.target - m.completed), 0);

		percentage = getWeightedPeriodAdherence(summaries);
	}

	return {
		habitId: habit.id,
		period: habit.frequency_type === "weekly" ? "week" : "month",
		expected,
		logCount: doneSoFar,
		missed,
		percentage,
	};
};
