import { startOfDay, subDays } from "date-fns";
import type { HabitWithLogs } from "@/types/habit.types";

export const getEffectiveIntervalEnd = (habit: HabitWithLogs, today = startOfDay(new Date())) => {
	const createdAt = startOfDay(new Date(habit.created_at));

	const hasLogToday = (habit.logs ?? []).some(
		(l) => startOfDay(new Date(l.log_date)).getTime() === today.getTime()
	);

	const isCreatedToday = createdAt.getTime() === today.getTime();

	// If habit is new and unlogged, today is not a valid opportunity
	return isCreatedToday && !hasLogToday ? subDays(today, 1) : today;
};
