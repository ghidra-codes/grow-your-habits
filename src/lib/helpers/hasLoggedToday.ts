import type { HabitWithLogs } from "@/types/habit.types";
import { getTodayDate } from "./getTodayDate";

export const hasLoggedToday = (habit: HabitWithLogs) =>
	habit.logs?.some((log) => log.log_date === getTodayDate()) ?? false;
