import type { PlantStage } from "@/types/plant.types";

/**
 * Determines plant stage (1 to 5) based on accumulated growth_score.
 */
export const getPlantStageFromGrowth = (growth: number): PlantStage => {
	if (growth >= 150) return 5;
	if (growth >= 80) return 4;
	if (growth >= 40) return 3;
	if (growth >= 20) return 2;

	return 1;
};
