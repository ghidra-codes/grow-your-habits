import type { HabitWithRelations } from "@/types/habit.types";
import { useState } from "react";

const useHabitLogModal = () => {
	const [logOptionsHabit, setLogOptionsHabit] = useState<HabitWithRelations | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const openModal = (habit: HabitWithRelations) => {
		setLogOptionsHabit(habit);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
		setLogOptionsHabit(null);
	};

	return {
		logOptionsHabit,
		isOpen,
		openModal,
		closeModal,
	};
};

export default useHabitLogModal;
