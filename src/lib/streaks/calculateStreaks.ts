import type { HabitWithLogs } from "@/types/habit.types";
import { calculateDailyStreak } from "./calculateDailyStreak";
import { calculateWeeklyStreak } from "./calculateWeeklyStreak";
import { calculateMonthlyStreak } from "./calculateMonthlyStreak";

const STREAK_PROCESSORS = {
	daily: calculateDailyStreak,
	weekly: calculateWeeklyStreak,
	monthly: calculateMonthlyStreak,
} as const;

export const calculateStreaks = (habit: HabitWithLogs) => {
	const processor = STREAK_PROCESSORS[habit.frequency_type];

	return processor(habit);
};
