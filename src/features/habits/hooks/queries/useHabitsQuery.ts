import { getHabits } from "@/features/habits/data/habits";
import type { HabitWithLogs } from "@/types/habit.types";
import { habitsKey } from "@/lib/data/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useHabitsQuery = (userId: string) =>
	useQuery<HabitWithLogs[]>({
		queryKey: habitsKey(userId),

		queryFn: async () => {
			const { data, error } = await getHabits(userId);

			if (error) throw new Error(error.message);

			return data ?? [];
		},

		refetchOnMount: false,
		refetchOnWindowFocus: false,
		retry: 1,
	});
