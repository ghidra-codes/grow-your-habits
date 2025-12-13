import { addHabit } from "@/features/habits/data/habits";
import { habitsKey } from "@/lib/data/queryKeys";
import { normalizeHabit } from "@/lib/habits";
import type { HabitPayload, HabitWithLogs } from "@/types/habit.types";
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
			const key = habitsKey(userId);

			await queryClient.cancelQueries({ queryKey: key });

			const prev = queryClient.getQueryData<HabitWithLogs[]>(key) || [];

			const tempHabit: HabitWithLogs = {
				id: `temp-${Date.now()}`,
				name: data.name,
				description: data.description,
				user_id: userId,
				created_at: new Date().toISOString(),
				frequency_type: data.frequency_type,
				target_per_week: data.target_per_week,
				target_per_month: data.target_per_month,
				logs: [],
			};

			queryClient.setQueryData(key, [tempHabit, ...prev]);

			return { prev };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(habitsKey(userId), ctx.prev);
			}
		},

		onSuccess: (savedHabit) => {
			queryClient.setQueryData<HabitWithLogs[]>(habitsKey(userId), (prev = []) => {
				const withoutTemp = prev.filter((habit) => !habit.id.startsWith("temp-"));

				if (!savedHabit) return withoutTemp;

				const normalized: HabitWithLogs = {
					...normalizeHabit(savedHabit),
					logs: [],
				};

				return [...withoutTemp, normalized].sort(
					(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
			});
		},
	});
};
