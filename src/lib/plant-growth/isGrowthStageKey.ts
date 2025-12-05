import { GROWTH_STAGES, type GrowthStageKey } from "@/features/plant/config/growthStageConfig";

export const isGrowthStageKey = (key: number): key is GrowthStageKey => key in GROWTH_STAGES;
