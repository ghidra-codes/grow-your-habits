import { updateHabit } from "@/features/habits/data/habits";
import type { Habit, UpdateHabitPayload } from "@/types/habit.types";
import { habitsKey } from "@/utils/helpers/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateHabit = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ habitId, ...payload }: UpdateHabitPayload) => {
			const { data, error } = await updateHabit(
				habitId,
				payload.name,
				payload.description,
				payload.frequency_type,
				payload.target_per_week,
				payload.target_per_month
			);

			if (error) throw new Error(error.message);

			return data;
		},

		onMutate: async ({ habitId, ...payload }) => {
			const key = habitsKey(userId);

			await queryClient.cancelQueries({ queryKey: key });

			const prev = queryClient.getQueryData<Habit[]>(key) || [];

			queryClient.setQueryData<Habit[]>(key, (old = []) =>
				old.map((habit) => (habit.id === habitId ? { ...habit, ...payload } : habit))
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
