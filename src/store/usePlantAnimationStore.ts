import { create } from "zustand";

interface PlantAnimationState {
	isEnabled: boolean;
}

export const usePlantAnimationStore = create<PlantAnimationState>(() => ({
	isEnabled: true,
}));

// ACTIONS

export const setAnimEnabled = (isEnabled: boolean) => {
	usePlantAnimationStore.setState({ isEnabled });
};

// SELECTORS

export const usePlantAnimEnabled = () => usePlantAnimationStore((state) => state.isEnabled);

export const usePlantAnimActions = () => ({
	enable: () => setAnimEnabled(true),
	disable: () => setAnimEnabled(false),
});
