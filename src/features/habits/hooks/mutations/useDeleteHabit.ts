import { deleteHabit } from "@/features/habits/data/habits";
import type { HabitWithLogs } from "@/types/habit.types";
import { habitsKey } from "@/lib/data/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteHabit = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (habitId: string) => {
			const { error } = await deleteHabit(habitId);
			if (error) throw new Error(error.message);
			return habitId;
		},

		onMutate: async (habitId) => {
			const key = habitsKey(userId);
			await queryClient.cancelQueries({ queryKey: key });

			const prev = queryClient.getQueryData<HabitWithLogs[]>(key) ?? [];

			queryClient.setQueryData(
				key,
				prev.filter((h) => h.id !== habitId)
			);

			return { prev };
		},

		onError: (_err, _id, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(habitsKey(userId), ctx.prev);
			}
		},
	});
};
