import type { HabitWithRelations } from "@/types/habit.types";
import getTodayDate from "@/utils/helpers/getTodayDate";
import { habitsKey } from "@/utils/helpers/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabitLog } from "../../data/habit-logs";

export const useLogHabit = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (habitId: string) => {
			const { data, error } = await createHabitLog(habitId, userId);

			if (error) throw new Error(error.message);

			return { data, habitId };
		},

		onMutate: async (habitId: string) => {
			const key = habitsKey(userId);
			const today = getTodayDate();

			await queryClient.cancelQueries({ queryKey: key });

			const prevHabits = queryClient.getQueryData<HabitWithRelations[]>(key);

			queryClient.setQueryData<HabitWithRelations[]>(key, (old = []) =>
				old.map((habit) =>
					habit.id === habitId ? { ...habit, logs: [{ id: "temp", log_date: today }] } : habit
				)
			);

			return { prevHabits };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.prevHabits) queryClient.setQueryData(habitsKey(userId), ctx.prevHabits);
		},

		onSuccess: (result, habitId) => {
			queryClient.setQueryData<HabitWithRelations[]>(habitsKey(userId), (old = []) =>
				old.map((habit) =>
					habit.id === habitId ? { ...habit, logs: result.data ? [result.data] : [] } : habit
				)
			);
		},
	});
};
