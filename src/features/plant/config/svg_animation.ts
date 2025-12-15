import type { PlantStageOrZero } from "@/types/plant.types";

type SvgAnimationConfig = {
	scale: number;
	rotate: number;
	duration: number;
};

export const SVG_ANIMATION_CONFIG: Record<PlantStageOrZero, SvgAnimationConfig> = {
	0: { scale: 1, rotate: 1, duration: 0 },
	1: { scale: 1.01, rotate: 1.003, duration: 4 },
	2: { scale: 1.013, rotate: 1.003, duration: 4 },
	3: { scale: 1.015, rotate: 1.005, duration: 3 },
	4: { scale: 1.02, rotate: 1.01, duration: 4 },
	5: { scale: 1.022, rotate: 1.012, duration: 4.5 },
};
