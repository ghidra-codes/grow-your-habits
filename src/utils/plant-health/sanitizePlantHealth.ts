import type { PlantHealth } from "@/types/plant.types";

export const sanitizePlantHealth = (value: number): PlantHealth => {
	const clamped = Math.min(100, Math.max(0, value));

	return clamped as PlantHealth;
};
