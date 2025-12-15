import { updateHabit } from "@/features/habits/data/habits";
import type { HabitWithLogs, UpdateHabitPayload } from "@/types/habit.types";
import { habitsKey } from "@/lib/data/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateHabit = (userId: string, onUpdated: (habit: HabitWithLogs) => void) => {
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

		onSuccess: (updatedHabit) => {
			if (!updatedHabit) return;

			queryClient.setQueryData<HabitWithLogs[]>(habitsKey(userId), (prev = []) =>
				prev
					.map((h) => (h.id === updatedHabit.id ? updatedHabit : h))
					.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			);

			onUpdated(updatedHabit);
		},
	});
};
