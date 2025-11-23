import { getHabits } from "@/features/habits/data/habits";
import type { Habit } from "@/types/habit.types";
import { useQuery } from "@tanstack/react-query";

export const habitsKey = (userId: string) => ["habits", userId];

export const useHabitsQuery = (userId: string) =>
	useQuery<Habit[]>({
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
