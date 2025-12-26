import type { HabitAdherence, HabitWithLogs } from "@/types/habit.types";
import { differenceInDays, startOfDay } from "date-fns";
import { getEffectiveIntervalEnd } from "./getEffectiveIntervalEnd";
import { getWeightedDailyConsistency } from "./getWeightedDailyConsistency";

/**
 * Adherence philosophy:
 * - Past units are evaluated
 * - Current unit can help but never hurt
 * - Recent behavior matters more than old
 * - Adherence reflects consistency, not effort
 */

/**
 * Calculates adherence for daily habits using weighted consistency.
 */
export const calculateDailyAdherence = (habit: HabitWithLogs): HabitAdherence => {
	if (habit.frequency_type !== "daily") {
		throw new Error("calculateDailyAdherence called for non-daily habit");
	}

	const today = startOfDay(new Date());
	const adherenceBoundary = getEffectiveIntervalEnd(habit, today);
	const createdAt = startOfDay(new Date(habit.created_at));

	const expected = Math.max(0, differenceInDays(adherenceBoundary, createdAt));

	const logCount = (habit.logs ?? []).filter(
		(l) => startOfDay(new Date(l.log_date)).getTime() <= adherenceBoundary.getTime()
	).length;

	const percentage = getWeightedDailyConsistency(habit);

	return {
		habitId: habit.id,
		period: "day",
		expected,
		logCount,
		missed: Math.max(0, expected - logCount),
		percentage,
	};
};
