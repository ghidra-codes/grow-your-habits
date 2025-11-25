import type { HabitWithLogs, HabitAdherence } from "@/types/habit.types";
import { calculateHabitAdherence } from "@/utils/calculateHabitAdherence";
import { useAllHabitSchedules } from "../habit-schedule/useAllHabitSchedules";

export const useHabitAdherence = (habitsData: HabitWithLogs[], userId: string) => {
	const { data: schedules, isLoading, isError, error } = useAllHabitSchedules(userId);

	let adherenceByHabitId: Record<string, HabitAdherence> = {};

	if (!isLoading && !isError) {
		const habits = habitsData ?? [];
		const schedulesData = schedules ?? [];

		for (const habit of habits) {
			const habitLogs = habit.habit_logs ?? [];
			const habitSchedule = schedulesData
				.filter((schedule) => schedule.habit_id === habit.id)
				.map((schedule) => schedule.weekday);

			adherenceByHabitId[habit.id] = calculateHabitAdherence(habit, habitLogs, habitSchedule);
		}
	}

	return {
		adherenceByHabitId,
		isLoading,
		error,
	};
};
