import type { HabitWithRelations } from "@/types/habit.types";
import getTodayDate from "./getTodayDate";

export const hasLoggedToday = (habit: HabitWithRelations) =>
	habit.logs?.some((log) => log.log_date === getTodayDate()) ?? false;
