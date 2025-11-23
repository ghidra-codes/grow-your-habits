import { addHabit } from "@/features/habits/data/habits";
import type { Habit } from "@/types/habit.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { habitsKey } from "./useHabitsQuery";

export const useAddHabit = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ name, description }: { name: string; description: string }) => {
			const { data, error } = await addHabit(name, userId, description);

			if (error) throw new Error(error.message);

			return data;
		},

		onMutate: async (vars) => {
			await queryClient.cancelQueries({ queryKey: habitsKey(userId) });

			const prev = queryClient.getQueryData<Habit[]>(habitsKey(userId)) || [];

			const tempHabit: Habit = {
				id: `temp-${Date.now()}`,
				name: vars.name,
				description: vars.description,
				user_id: userId,
				created_at: new Date().toISOString(),
				frequency_type: "daily",
				target_per_week: null,
				target_per_month: null,
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
