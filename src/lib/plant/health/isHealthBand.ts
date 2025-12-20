import type { PlantHealthThresholds } from "@/types/plant.types";

export const isHealthBand = (value: unknown): value is PlantHealthThresholds =>
	value === "critical" || value === "normal" || value === "thriving";
