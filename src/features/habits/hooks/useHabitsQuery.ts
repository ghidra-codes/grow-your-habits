import { getHabits } from "@/features/habits/data/habits";
import type { HabitWithLogs } from "@/types/habit.types";
import { habitsKey } from "@/utils/helpers/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useHabitsQuery = (userId: string) =>
	useQuery<HabitWithLogs[]>({
		queryKey: habitsKey(userId),

		queryFn: async () => {
			const { data, error } = await getHabits(userId);

			if (error) throw new Error(error.message);

			return data ?? [];
		},

		staleTime: Infinity,
		gcTime: 1000 * 60 * 5,
		retry: 1,
		refetchOnWindowFocus: false,
	});
