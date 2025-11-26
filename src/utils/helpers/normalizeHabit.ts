import type { Habit, HabitWithRelations } from "@/types/habit.types";
import type { Tables } from "@/types/supabase.types";
import { assertFrequencyType } from "./assertFrequencyType";

export const normalizeHabit = (habit: Tables<"habits">): Habit => ({
	...habit,
	frequency_type: assertFrequencyType(habit.frequency_type),
});

export const normalizeHabitWithRelations = (
	habit: Tables<"habits"> & {
		habit_logs?: Pick<Tables<"habit_logs">, "id" | "log_date">[] | null;
		habit_schedule?: { weekday: Tables<"habit_schedule">["weekday"] }[] | null;
	}
): HabitWithRelations => ({
	...habit,
	frequency_type: assertFrequencyType(habit.frequency_type),
	logs: habit.habit_logs ?? [],
	schedules: (habit.habit_schedule ?? []).map((s) => s.weekday),
});
