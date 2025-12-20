import type { PlantHealthThresholds } from "@/types/plant.types";

export const getHealthBand = (health: number): PlantHealthThresholds => {
	if (health <= 20) return "critical";
	if (health >= 90) return "thriving";

	return "normal";
};
