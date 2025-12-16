import type { HabitWithLogs } from "@/types/habit.types";
import { useState } from "react";

export const useHabitLogModal = () => {
	const [logOptionsHabit, setLogOptionsHabit] = useState<HabitWithLogs | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const openModal = (habit: HabitWithLogs) => {
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
