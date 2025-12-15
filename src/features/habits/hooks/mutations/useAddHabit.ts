import { addHabit } from "@/features/habits/data/habits";
import { habitsKey } from "@/lib/data/queryKeys";
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

		onMutate: async (payload) => {
			const key = habitsKey(userId);
			await queryClient.cancelQueries({ queryKey: key });

			const prev = queryClient.getQueryData<HabitWithLogs[]>(key) ?? [];

			const optimistic: HabitWithLogs = {
				id: `temp-${Date.now()}`,
				name: payload.name,
				description: payload.description,
				user_id: userId,
				created_at: new Date().toISOString(),
				frequency_type: payload.frequency_type,
				target_per_week: payload.target_per_week,
				target_per_month: payload.target_per_month,
				logs: [],
			};

			queryClient.setQueryData(key, [optimistic, ...prev]);

			return { prev };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(habitsKey(userId), ctx.prev);
			}
		},

		onSuccess: (savedHabit) => {
			if (!savedHabit) return;

			queryClient.setQueryData<HabitWithLogs[]>(habitsKey(userId), (prev = []) =>
				[savedHabit, ...prev.filter((h) => !h.id.startsWith("temp-"))].sort(
					(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				)
			);
		},
	});
};
