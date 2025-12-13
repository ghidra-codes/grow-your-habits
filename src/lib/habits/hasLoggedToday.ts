import type { HabitWithLogs } from "@/types/habit.types";
import { getTodayDate } from "../dates";

export const hasLoggedToday = (habit: HabitWithLogs) =>
	habit.logs?.some((log) => log.log_date === getTodayDate()) ?? false;
