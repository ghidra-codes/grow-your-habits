import type { PlantHealth } from "@/types/plant.types";

export const sanitizePlantHealth = (value: number): PlantHealth => {
	return Math.min(100, Math.max(0, value));
};
