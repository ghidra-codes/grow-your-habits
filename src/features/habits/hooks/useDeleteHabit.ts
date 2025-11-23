import { deleteHabit } from "@/features/habits/data/habits";
import type { Habit } from "@/types/habit.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { habitsKey } from "./useHabitsQuery";

export const useDeleteHabit = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (habitId: string) => {
			const { error } = await deleteHabit(habitId);

			if (error) throw new Error(error.message);

			return habitId;
		},

		onMutate: async (habitId) => {
			await queryClient.cancelQueries({ queryKey: habitsKey(userId) });

			const prev = queryClient.getQueryData<Habit[]>(habitsKey(userId)) || [];

			queryClient.setQueryData(
				habitsKey(userId),
				prev.filter((h) => h.id !== habitId)
			);

			return { prev };
		},

		onError: (_err, _habitId, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(habitsKey(userId), ctx.prev);
			}
		},

		onSuccess: (habitId) => {
			queryClient.setQueryData<Habit[]>(habitsKey(userId), (prev = []) =>
				prev.filter((habit) => habit.id !== habitId)
			);
		},
	});
};
