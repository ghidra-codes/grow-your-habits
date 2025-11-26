import type { HabitLog } from "@/types/habit.types";
import { habitLogsKey } from "@/utils/helpers/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { getHabitLogs } from "../../data/habit-logs";

export const useHabitLogsQuery = (habitId: string, userId: string) =>
	useQuery<HabitLog[]>({
		queryKey: habitLogsKey(habitId, userId),

		queryFn: async () => {
			const { data, error } = await getHabitLogs(habitId, userId);

			if (error) throw new Error(error.message);

			return data ?? [];
		},

		staleTime: Infinity,
		gcTime: 1000 * 60 * 5,
		retry: 1,
	});
