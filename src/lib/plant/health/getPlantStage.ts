import type { PlantStage } from "@/types/plant.types";

export const getPlantStage = (health: number): PlantStage => {
	if (health >= 80) return 5;
	if (health >= 60) return 4;
	if (health >= 40) return 3;
	if (health >= 20) return 2;
	return 1;
};
