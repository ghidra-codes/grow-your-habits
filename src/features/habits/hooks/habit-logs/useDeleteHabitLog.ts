import type { HabitWithRelations } from "@/types/habit.types";
import getTodayDate from "@/utils/helpers/getTodayDate";
import { habitsKey } from "@/utils/helpers/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHabitLog } from "../../data/habit-logs";

export const useDeleteHabitLog = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (habitId: string) => {
			const { data, error } = await deleteHabitLog(habitId, userId);

			if (error) throw new Error(error.message);

			return { data, habitId };
		},

		onMutate: async (habitId: string) => {
			const key = habitsKey(userId);

			await queryClient.cancelQueries({ queryKey: key });

			const prevHabits = queryClient.getQueryData<HabitWithRelations[]>(key);

			queryClient.setQueryData<HabitWithRelations[]>(key, (old = []) =>
				old.map((habit) => {
					if (habit.id !== habitId) return habit;

					return {
						...habit,
						logs: (habit.logs ?? []).filter((log) => log.log_date !== getTodayDate()),
					};
				})
			);

			return { prevHabits };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.prevHabits) queryClient.setQueryData(habitsKey(userId), ctx.prevHabits);
		},

		onSuccess: (_result, habitId) => {
			queryClient.setQueryData<HabitWithRelations[]>(habitsKey(userId), (old = []) =>
				old.map((habit) => {
					if (habit.id !== habitId) return habit;

					return {
						...habit,
						logs: (habit.logs ?? []).filter((log) => log.log_date !== getTodayDate()),
					};
				})
			);
		},
	});
};
