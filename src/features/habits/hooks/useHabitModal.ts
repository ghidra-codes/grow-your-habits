import type { Habit } from "@/types/habit.types";
import { useMemo, useState } from "react";

export const useHabitModal = (selectedHabit: Habit | null) => {
	const [modalMode, setModalMode] = useState<"add" | "edit">("add");
	const [isOpen, setIsOpen] = useState(false);

	const openModal = (mode: "add" | "edit") => {
		setModalMode(mode);
		setIsOpen(true);
	};

	const closeModal = () => setIsOpen(false);

	const initialFormValues = useMemo(() => {
		if (modalMode !== "edit" || !selectedHabit) return null;

		return {
			name: selectedHabit.name,
			description: selectedHabit.description || "",
			frequency_type: selectedHabit.frequency_type,
			target_per_week: selectedHabit.target_per_week,
			target_per_month: selectedHabit.target_per_month,
		};
	}, [selectedHabit, modalMode]);

	return {
		modalMode,
		isOpen,
		openModal,
		closeModal,
		initialFormValues,
	};
};
