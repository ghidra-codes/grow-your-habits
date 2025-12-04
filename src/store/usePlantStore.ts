import { create } from "zustand";

export const usePlantStore = create<{
	health: number;
	setHealth: (value: number) => void;
}>((set) => ({
	health: 0,
	setHealth: (value) => set({ health: value }),
}));
