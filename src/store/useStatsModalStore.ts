import type { HabitWithLogs } from "@/types/habit.types";
import { create } from "zustand";

interface StatsModalState {
	isOpen: boolean;
	habit: HabitWithLogs | null;
}

export const useStatsModalStore = create<StatsModalState>(() => ({
	isOpen: false,
	habit: null,
}));

// ACTIONS

export const useStatsModalActions = () => ({
	open: (habit?: HabitWithLogs) =>
		useStatsModalStore.setState({
			isOpen: true,
			habit: habit ?? null,
		}),
	close: () =>
		useStatsModalStore.setState({
			isOpen: false,
			habit: null,
		}),
});

// SELECTORS

export const useStatsModalOpen = () => useStatsModalStore((state) => state.isOpen);

export const useStatsModalHabit = () => useStatsModalStore((state) => state.habit);
