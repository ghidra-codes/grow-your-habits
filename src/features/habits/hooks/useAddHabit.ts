import { addHabit } from "@/features/habits/data/habits";
import type { Habit, HabitPayload } from "@/types/habit.types";
import { habitsKey } from "@/utils/helpers/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddHabit = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: HabitPayload) => {
			const { data, error } = await addHabit(
				payload.name,
				userId,
				payload.description,
				payload.frequency_type,
				payload.target_per_week,
				payload.target_per_month
			);

			if (error) throw new Error(error.message);

			return data;
		},

		onMutate: async (data) => {
			await queryClient.cancelQueries({ queryKey: habitsKey(userId) });

			const prev = queryClient.getQueryData<Habit[]>(habitsKey(userId)) || [];

			const tempHabit: Habit = {
				id: `temp-${Date.now()}`,
				name: data.name,
				description: data.description,
				user_id: userId,
				created_at: new Date().toISOString(),
				frequency_type: data.frequency_type,
				target_per_week: data.target_per_week,
				target_per_month: data.target_per_month,
			};

			queryClient.setQueryData(habitsKey(userId), [tempHabit, ...prev]);

			return { prev };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(habitsKey(userId), ctx.prev);
			}
		},

		onSuccess: (savedHabit) => {
			queryClient.setQueryData<Habit[]>(habitsKey(userId), (prev = []) => {
				const withoutTemp = prev.filter((habit) => !habit.id.startsWith("temp-"));

				return savedHabit
					? [...withoutTemp, savedHabit].sort(
							(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					  )
					: withoutTemp;
			});
		},
	});
};
