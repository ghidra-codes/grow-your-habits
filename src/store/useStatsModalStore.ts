import { create } from "zustand";

interface StatsModalState {
	isOpen: boolean;
}

export const useStatsModalStore = create<StatsModalState>(() => ({
	isOpen: false,
}));

// ACTIONS

export const setModalOpen = (isOpen: boolean) => {
	useStatsModalStore.setState({ isOpen });
};

// SELECTORS

export const useStatsModalOpen = () => useStatsModalStore((state) => state.isOpen);

export const useStatsModalActions = () => ({
	open: () => setModalOpen(true),
	close: () => setModalOpen(false),
});
