import { getHabits } from "@/features/habits/data/habits";
import type { HabitWithRelations } from "@/types/habit.types";
import { habitsKey } from "@/utils/helpers/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useHabitsQuery = (userId: string) =>
	useQuery<HabitWithRelations[]>({
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
