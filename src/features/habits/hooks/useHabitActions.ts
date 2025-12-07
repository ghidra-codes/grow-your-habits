import type { Habit, HabitPayload, HabitWithLogs } from "@/types/habit.types";
import { useDeleteHabitLog } from "./mutations/useDeleteHabitLog";
import { useLogHabit } from "./mutations/useLogHabit";
import { useAddHabit } from "./mutations/useAddHabit";
import { useDeleteHabit } from "./mutations/useDeleteHabit";
import { useUpdateHabit } from "./mutations/useUpdateHabit";
import { updatePlantState } from "@/features/plant/data/plant-state";
import { supabase } from "@/lib/supabase-client";
import { useQueryClient } from "@tanstack/react-query";
import { plantStateKey } from "@/lib/helpers/queryKeys";

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
		const { data: existingHabits } = await supabase
			.from("habits")
			.select("id", { count: "exact", head: true })
			.eq("user_id", userId);

		const hasEverHadHabits = (existingHabits?.length ?? 0) > 0;

		await addHabit(payload);

		if (!hasEverHadHabits) {
			await updatePlantState(userId, {
				growth_score: 4,
			});

			await queryClient.refetchQueries({ queryKey: plantStateKey(userId) });
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
