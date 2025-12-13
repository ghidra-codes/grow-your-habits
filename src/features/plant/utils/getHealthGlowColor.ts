import { withAlpha } from "@/lib/ui";
import { PLANT_GLOW_COLORS } from "../constants/plant-glow-colors";

export const getHealthGlowColor = (health: number): string => {
	if (health <= 0) return withAlpha(PLANT_GLOW_COLORS.dead);
	if (health <= 15) return withAlpha(PLANT_GLOW_COLORS.decaying);
	if (health <= 30) return withAlpha(PLANT_GLOW_COLORS.very_bad);
	if (health <= 45) return withAlpha(PLANT_GLOW_COLORS.bad);
	if (health <= 60) return withAlpha(PLANT_GLOW_COLORS.low);
	if (health <= 75) return withAlpha(PLANT_GLOW_COLORS.medium);
	if (health <= 90) return withAlpha(PLANT_GLOW_COLORS.high);

	return withAlpha(PLANT_GLOW_COLORS.peak);
};
