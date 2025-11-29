import { create } from "zustand";

interface StatsModalStoreState {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}

export const useStatsModalStore = create<StatsModalStoreState>((set) => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
}));
