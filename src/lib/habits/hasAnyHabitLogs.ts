import type { HabitWithLogs } from "@/types/habit.types";

export const hasAnyHabitLogs = (habits: HabitWithLogs[]) => habits.some((habit) => habit.logs.length > 0);
