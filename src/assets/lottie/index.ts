import type { LottieAnimation } from "@/types/lottie.types";
import type { PlantStage } from "@/types/plant.types";

import stage1 from "./plant-1.json";
import stage2 from "./plant-2.json";
import stage3 from "./plant-3.json";
import stage4 from "./plant-4.json";
import stage5 from "./plant-5.json";

export const PLANT_ANIMATIONS: Record<PlantStage, LottieAnimation> = {
	1: stage1,
	2: stage2,
	3: stage3,
	4: stage4,
	5: stage5,
};
