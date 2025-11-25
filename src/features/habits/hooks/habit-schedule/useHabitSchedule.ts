import { useQuery } from "@tanstack/react-query";
import { getHabitSchedule } from "../../data/habit-schedule";
import { habitScheduleKey } from "@/utils/helpers/queryKeys";

export const useHabitScheduleQuery = (habitId: string) =>
	useQuery({
		queryKey: habitScheduleKey(habitId),
		queryFn: async () => {
			const { data, error } = await getHabitSchedule(habitId);
			if (error) throw new Error(error.message);
			return data ?? [];
		},
		staleTime: Infinity,
		gcTime: 1000 * 60 * 5,
	});
