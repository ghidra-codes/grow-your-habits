export const ORIGINAL_PLANT_COLORS = [
	"#9CC914",
	"#82B42F",
	"#B9D835",
	"#69980E",
	"#FFFFFF",
	"#FFE818",
	"#78B108",
	"#9DC105",
] as const;

export type PlantColorHex = (typeof ORIGINAL_PLANT_COLORS)[number];
