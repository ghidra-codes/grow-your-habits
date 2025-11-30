import type { HabitWithRelations } from "@/types/habit.types";
import { calculateDailyStreak } from "./streaks/calculateDailyStreak";
import { calculateWeeklyStreak } from "./streaks/calculateWeeklyStreak";
import { calculateMonthlyStreak } from "./streaks/calculateMonthlyStreak";
import { calculateCustomStreak } from "./streaks/calculateCustomStreak";

const STREAK_PROCESSORS = {
	daily: calculateDailyStreak,
	weekly: calculateWeeklyStreak,
	monthly: calculateMonthlyStreak,
	custom: calculateCustomStreak,
} as const;

export const calculateStreaks = (habit: HabitWithRelations) => {
	const processor = STREAK_PROCESSORS[habit.frequency_type];

	return processor(habit);
};
