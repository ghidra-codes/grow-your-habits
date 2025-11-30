import type { Habit, HabitPayload, HabitWithRelations } from "@/types/habit.types";
import { hasLoggedToday } from "@/utils/helpers/hasLoggedToday";
import { useDeleteHabitLog } from "./mutations/useDeleteHabitLog";
import { useLogHabit } from "./mutations/useLogHabit";
import { useAddHabit } from "./mutations/useAddHabit";
import { useDeleteHabit } from "./mutations/useDeleteHabit";
import { useUpdateHabit } from "./mutations/useUpdateHabit";

export function useHabitActions(
	userId: string,
	selectedHabit: Habit | null,
	setSelectedHabit: (habit: Habit | null) => void,
	closeModal: () => void
) {
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

	const handleToggleHabit = async (habit: HabitWithRelations) => {
		const isDone = hasLoggedToday(habit);
		const mutateFn = isDone ? deleteHabitLog : logHabit;
		await mutateFn(habit.id);
	};

	return {
		handleAddHabit,
		handleUpdateHabit,
		handleDeleteHabit,
		handleToggleHabit,
		isMutating: isLogging || isDeletingLog,
	};
}
