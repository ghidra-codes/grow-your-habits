export type GrowthStageKey = keyof typeof GROWTH_STAGES & number;

export const GROWTH_STAGES = {
	0: { required: 0, name: "SOIL" },
	1: { required: 1, name: "SEED" },
	2: { required: 20, name: "SPROUT" },
	3: { required: 40, name: "SAPLING" },
	4: { required: 80, name: "BLOOMING" },
	5: { required: 150, name: "FLOURISHING" },
} as const;
