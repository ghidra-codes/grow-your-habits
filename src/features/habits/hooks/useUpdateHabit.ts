import { updateHabit } from "@/features/habits/data/habits";
import type { Habit } from "@/types/habit.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { habitsKey } from "./useHabitsQuery";

export const useUpdateHabit = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			habitId,
			name,
			description,
		}: {
			habitId: string;
			name: string;
			description: string;
		}) => {
			const { data, error } = await updateHabit(habitId, name, description);

			if (error) throw new Error(error.message);

			return data;
		},

		onMutate: async (vars) => {
			await queryClient.cancelQueries({ queryKey: habitsKey(userId) });

			const prev = queryClient.getQueryData<Habit[]>(habitsKey(userId)) || [];

			queryClient.setQueryData<Habit[]>(habitsKey(userId), (old = []) =>
				old.map((habit) =>
					habit.id === vars.habitId
						? {
								...habit,
								name: vars.name,
								description: vars.description,
						  }
						: habit
				)
			);

			return { prev };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(habitsKey(userId), ctx.prev);
			}
		},

		onSuccess: (updatedHabit) => {
			queryClient.setQueryData<Habit[]>(habitsKey(userId), (prev = []) => {
				const withoutOld = prev.filter((habit) => habit.id !== updatedHabit?.id);

				return updatedHabit
					? [...withoutOld, updatedHabit].sort(
							(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					  )
					: prev;
			});
		},
	});
};
