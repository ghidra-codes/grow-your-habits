import type { HabitLog, HabitWithLogs } from "@/types/habit.types";
import { habitsKey } from "@/lib/helpers/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHabitLog } from "../../data/habit-logs";
import type { LogCtx, LogVars, ServiceResponse } from "@/types/service.types";

export const useDeleteHabitLog = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation<ServiceResponse<HabitLog | null>, Error, LogVars, LogCtx>({
		mutationFn: async ({ habitId, date }) => {
			return await deleteHabitLog(habitId, userId, date);
		},

		onMutate: async ({ habitId, date }) => {
			const key = habitsKey(userId);
			await queryClient.cancelQueries({ queryKey: key });

			const prevHabits = queryClient.getQueryData<HabitWithLogs[]>(key);

			queryClient.setQueryData<HabitWithLogs[]>(key, (old = []) =>
				old.map((habit) =>
					habit.id !== habitId
						? habit
						: {
								...habit,
								logs: (habit.logs ?? []).filter((log) => log.log_date !== date),
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

		onSuccess: (_result, { habitId, date }) => {
			queryClient.setQueryData<HabitWithLogs[]>(habitsKey(userId), (old = []) =>
				old.map((habit) =>
					habit.id !== habitId
						? habit
						: {
								...habit,
								logs: (habit.logs ?? []).filter((log) => log.log_date !== date),
						  }
				)
			);
		},
	});
};
