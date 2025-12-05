import { updateHabit } from "@/features/habits/data/habits";
import type { HabitWithLogs, UpdateHabitPayload } from "@/types/habit.types";
import { habitsKey } from "@/lib/helpers/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeHabit } from "@/lib/helpers/normalizeHabit";

export const useUpdateHabit = (userId: string, onUpdated: (habit: HabitWithLogs | null) => void) => {
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

			const normalized: HabitWithLogs = {
				...normalizeHabit(updatedHabit),
				logs: [],
			};

			queryClient.setQueryData<HabitWithLogs[]>(habitsKey(userId), (prev = []) => {
				const withoutOld = prev.filter((h) => h.id !== normalized.id);

				return [...withoutOld, normalized].sort(
					(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);
			});

			await queryClient.invalidateQueries({
				queryKey: habitsKey(userId),
				refetchType: "active",
			});

			onUpdated(normalized);
		},

		onError: (err) => console.error("Failed to update habit:", err),
	});
};
