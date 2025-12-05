import type { Habit, HabitWithLogs } from "@/types/habit.types";
import type { Tables } from "@/types/supabase.types";
import { assertFrequencyType } from "./assertFrequencyType";

export const normalizeHabit = (habit: Tables<"habits">): Habit => ({
	...habit,
	frequency_type: assertFrequencyType(habit.frequency_type),
});

export const normalizeHabitWithLogs = (
	habit: Tables<"habits"> & {
		habit_logs?: Pick<Tables<"habit_logs">, "id" | "log_date">[] | null;
	}
): HabitWithLogs => ({
	...habit,
	frequency_type: assertFrequencyType(habit.frequency_type),
	logs: habit.habit_logs ?? [],
});
