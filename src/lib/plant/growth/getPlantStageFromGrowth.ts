import { GROWTH_STAGES, type GrowthStageKey } from "@/features/plant/config/growth-stage";

export const getPlantStageFromGrowth = (growth: number): GrowthStageKey => {
	let currentStage: GrowthStageKey = 0;

	const keys = Object.keys(GROWTH_STAGES)
		.map(Number)
		.filter((num): num is GrowthStageKey => num in GROWTH_STAGES);

	for (const key of keys) {
		if (growth >= GROWTH_STAGES[key].required) currentStage = key;
	}

	return currentStage;
};
