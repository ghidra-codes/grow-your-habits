import { GROWTH_STAGES, type GrowthStageKey } from "@/features/plant/config/growthStageConfig";
import { isGrowthStageKey } from "./isGrowthStageKey";

export const getPointsToNextStage = (growthPoints: number, stage: GrowthStageKey): number | null => {
	const nextKey = stage + 1;

	if (!isGrowthStageKey(nextKey)) return null;

	return GROWTH_STAGES[nextKey].required - growthPoints;
};
