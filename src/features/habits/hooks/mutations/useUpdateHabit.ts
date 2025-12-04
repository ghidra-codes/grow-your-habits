import { updateHabit } from "@/features/habits/data/habits";
import type { Habit, UpdateHabitPayload } from "@/types/habit.types";
import { habitsKey } from "@/utils/helpers/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateHabit = (userId: string, onUpdated: (updatedHabit: Habit | null) => void) => {
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

		onSuccess: async (updatedHabit) => {
			if (!updatedHabit) return;

			queryClient.setQueryData<Habit[]>(habitsKey(userId), (prev = []) => {
				const withoutOld = prev.filter((habit) => habit.id !== updatedHabit.id);
				return [...withoutOld, updatedHabit].sort(
					(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
			});

			await queryClient.invalidateQueries({ queryKey: habitsKey(userId), refetchType: "active" });

			onUpdated(updatedHabit);
		},

		onError: (err) => console.error("Failed to update habit:", err),
	});
};
