import type { HabitLogState, HabitWithLogs } from "@/types/habit.types";
import { habitLogsKey, habitsKey } from "@/utils/helpers/queryKeys";
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
			const key = habitLogsKey(userId, habitId);

			await queryClient.cancelQueries({ queryKey: habitsKey(userId) });

			const prevHabits = queryClient.getQueryData<HabitWithLogs[]>(habitsKey(userId));
			const prev = queryClient.getQueryData<HabitLogState>(key);

			queryClient.setQueryData<HabitWithLogs[]>(habitsKey(userId), (old = []) =>
				old.map((habit) => (habit.id === habitId ? { ...habit, habit_logs: [] } : habit))
			);

			queryClient.setQueryData<HabitLogState>(key, {
				hasLoggedToday: false,
				logDate: undefined,
			});

			return { prev, prevHabits, habitId };
		},

		onError: (_err, _vars, ctx) => {
			if (!ctx) return;

			if (ctx.prev) queryClient.setQueryData(habitLogsKey(userId, ctx.habitId), ctx.prev);
			if (ctx.prevHabits) queryClient.setQueryData(habitsKey(userId), ctx.prevHabits);
		},

		onSuccess: (_result, habitId) => {
			queryClient.setQueryData<HabitWithLogs[]>(habitsKey(userId), (old = []) =>
				old.map((habit) => (habit.id === habitId ? { ...habit, habit_logs: [] } : habit))
			);
		},
	});
};
