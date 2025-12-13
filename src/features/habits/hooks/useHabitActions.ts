import type { Habit, HabitPayload, HabitWithLogs } from "@/types/habit.types";
import { useDeleteHabitLog } from "./mutations/useDeleteHabitLog";
import { useLogHabit } from "./mutations/useLogHabit";
import { useAddHabit } from "./mutations/useAddHabit";
import { useDeleteHabit } from "./mutations/useDeleteHabit";
import { useUpdateHabit } from "./mutations/useUpdateHabit";
import { getPlantState, initPlantState } from "@/features/plant/data/plant-state";
import { useQueryClient } from "@tanstack/react-query";
import { plantStateKey } from "@/lib/data/queryKeys";

export const useHabitActions = (
	userId: string,
	selectedHabit: Habit | null,
	setSelectedHabit: (habit: Habit | null) => void,
	closeModal: () => void
) => {
	const queryClient = useQueryClient();
	// Habit mutations
	const { mutateAsync: addHabit } = useAddHabit(userId);
	const { mutateAsync: deleteHabit } = useDeleteHabit(userId);
	const { mutateAsync: updateHabit } = useUpdateHabit(userId, (updated) => {
		setSelectedHabit(updated);
		closeModal();
	});

	// Habit log mutations
	const { mutateAsync: logHabit, isPending: isLogging } = useLogHabit(userId);
	const { mutateAsync: deleteHabitLog, isPending: isDeletingLog } = useDeleteHabitLog(userId);

	// Handler functions
	const handleAddHabit = async (payload: HabitPayload) => {
		await addHabit(payload);

		// Ensure plant_state exists
		const { data: plant_state } = await getPlantState(userId);
		if (!plant_state) {
			await initPlantState(userId);
			await queryClient.invalidateQueries({ queryKey: plantStateKey(userId) });
		}

		closeModal();
	};

	const handleUpdateHabit = async (payload: HabitPayload) => {
		if (!selectedHabit) return;

		await updateHabit({ habitId: selectedHabit.id, ...payload });
	};

	const handleDeleteHabit = async () => {
		if (!selectedHabit) return;

		await deleteHabit(selectedHabit.id);
		setSelectedHabit(null);
	};

	const handleToggleHabit = async (habit: HabitWithLogs, date: string) => {
		const alreadyLogged = habit.logs.some((log) => log.log_date === date) ?? false;

		if (alreadyLogged) await deleteHabitLog({ habitId: habit.id, date });
		else await logHabit({ habitId: habit.id, date });
	};

	return {
		handleAddHabit,
		handleUpdateHabit,
		handleDeleteHabit,
		handleToggleHabit,
		isMutating: isLogging || isDeletingLog,
	};
};
