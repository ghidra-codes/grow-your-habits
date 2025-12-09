import type { Database, Tables } from "./supabase.types";

// STAGE

export type PlantStage = 1 | 2 | 3 | 4 | 5;

export type PlantStageOrZero = PlantStage | 0;

// PLANT

export type PlantState = Tables<"plant_state">;

export type PlantStateInsert = Database["public"]["Tables"]["plant_state"]["Insert"];

export type PlantStateUpdate = Database["public"]["Tables"]["plant_state"]["Update"];

export type PlantEntry = {
	state: PlantState;
	stage: PlantStageOrZero;
	isInitialized: boolean;
};

/** A number between 0 and 100 */
export type PlantHealth = number;
