import type { HabitLog, HabitWithLogs } from "@/types/habit.types";
import { habitsKey, plantStateKey } from "@/lib/data/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHabitLog } from "../../data/habit-logs";
import type { LogCtx, LogVars, ServiceResponse } from "@/types/service.types";
import { updatePlantHealth } from "@/features/plant/data/plant-state";
import { BASELINE_HEALTH } from "@/features/plant/config/health";

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
			queryClient.setQueryData<HabitWithLogs[]>(habitsKey(userId), (old = []) => {
				const updated = old.map((habit) =>
					habit.id !== habitId
						? habit
						: {
								...habit,
								logs: habit.logs.filter((log) => log.log_date !== date),
						  }
				);

				const hasAnyLogsLeft = updated.some((h) => h.logs.length > 0);

				// RESET SERVER HEALTH TO BASELINE
				if (!hasAnyLogsLeft) {
					void updatePlantHealth(userId, BASELINE_HEALTH).then(() => {
						queryClient.invalidateQueries({ queryKey: plantStateKey(userId) });
					});
				}

				return updated;
			});
		},
	});
};
