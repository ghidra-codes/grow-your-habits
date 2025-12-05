import type { HabitWithLogs } from "@/types/habit.types";
import { calculateDailyStreak } from "./streaks/calculateDailyStreak";
import { calculateWeeklyStreak } from "./streaks/calculateWeeklyStreak";
import { calculateMonthlyStreak } from "./streaks/calculateMonthlyStreak";

const STREAK_PROCESSORS = {
	daily: calculateDailyStreak,
	weekly: calculateWeeklyStreak,
	monthly: calculateMonthlyStreak,
} as const;

export const calculateStreaks = (habit: HabitWithLogs) => {
	const processor = STREAK_PROCESSORS[habit.frequency_type];

	return processor(habit);
};
