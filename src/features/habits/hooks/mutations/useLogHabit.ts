import type { HabitLog, HabitWithRelations } from "@/types/habit.types";
import { habitsKey } from "@/utils/helpers/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabitLog } from "../../data/habit-logs";
import type { LogCtx, LogVars, ServiceResponse } from "@/types/service.types";

export const useLogHabit = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation<ServiceResponse<HabitLog | null>, Error, LogVars, LogCtx>({
		mutationFn: async ({ habitId, date }) => {
			return await createHabitLog(habitId, userId, date);
		},

		onMutate: async ({ habitId, date }) => {
			const key = habitsKey(userId);
			await queryClient.cancelQueries({ queryKey: key });

			const prevHabits = queryClient.getQueryData<HabitWithRelations[]>(key);

			queryClient.setQueryData<HabitWithRelations[]>(key, (old = []) =>
				old.map((habit) =>
					habit.id !== habitId
						? habit
						: {
								...habit,
								logs: [...(habit.logs ?? []), { id: "temp", log_date: date }],
						  }
				)
			);

			return { prevHabits };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.prevHabits) {
				queryClient.setQueryData(habitsKey(userId), ctx.prevHabits);
			}
		},

		onSuccess: ({ data }, { habitId, date }) => {
			queryClient.setQueryData<HabitWithRelations[]>(habitsKey(userId), (old = []) =>
				old.map((habit) => {
					if (habit.id !== habitId) return habit;

					// Remove optimistic log for this date
					const filtered = (habit.logs ?? []).filter((log) => log.log_date !== date);

					return {
						...habit,
						logs: data ? [...filtered, data] : filtered,
					};
				})
			);
		},
	});
};
