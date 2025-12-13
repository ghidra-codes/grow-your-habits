import type { HabitWithLogs } from "@/types/habit.types";
import { generateCurrentPeriod } from "../dates";

export const getCurrentPeriodProgress = (habit: HabitWithLogs) => {
	if (habit.frequency_type === "daily") return null;

	const { period } = generateCurrentPeriod(habit);

	const completed = period.filter((d) => d.status === "completed").length;

	const weeklyTarget = habit.target_per_week ?? 0;
	const monthlyTarget = habit.target_per_month ?? 0;

	const target = habit.frequency_type === "weekly" ? weeklyTarget : monthlyTarget;

	return {
		current: completed,
		target,
		percentage: target > 0 ? Math.min(100, (completed / target) * 100) : 0,
	};
};
