import { PLANT_RECOLOR_PROFILES } from "../constants/plant-recolor-profiles";

/**
 * Selects an appropriate plant color profile based on health level.
 */
export const getPlantColorProfile = (health: number) => {
	if (health <= 0) return null;

	if (health <= 20) return PLANT_RECOLOR_PROFILES.decaying;

	if (health <= 40) return PLANT_RECOLOR_PROFILES.low;

	if (health <= 80) return PLANT_RECOLOR_PROFILES.medium;

	return PLANT_RECOLOR_PROFILES.high;
};
