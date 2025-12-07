import { supabase } from "@/lib/supabase-client";
import type { ServiceResponse } from "@/types/service.types";
import type { PlantState, PlantStateInsert, PlantStateUpdate } from "@/types/plant.types";

/**
 * Fetch plant_state row for a specific user.
 */
export const getPlantState = async (userId: string): Promise<ServiceResponse<PlantState>> => {
	const { data, error } = await supabase.from("plant_state").select("*").eq("user_id", userId).single();

	if (error) return { data: null, error };

	return { data, error: null };
};

/**
 * Creates the plant_state row for a user.
 * This is called when the user logs in the first time or plant_state does not exist.
 */
export const initPlantState = async (userId: string): Promise<ServiceResponse<PlantState>> => {
	const payload: PlantStateInsert = {
		user_id: userId,
		growth_score: 0,
		death_count: 0,
		last_growth_date: null,
	};

	const { data, error } = await supabase.from("plant_state").insert(payload).select().single();

	if (error) {
		console.error("PlantState Init Error:", error);
		return { data: null, error };
	}

	return { data, error: null };
};

/**
 * Generic update function to update any fields in plant_state.
 */
export const updatePlantState = async (
	userId: string,
	updates: PlantStateUpdate
): Promise<ServiceResponse<PlantState>> => {
	const { data, error } = await supabase
		.from("plant_state")
		.update({
			...updates,
			updated_at: new Date().toISOString(),
		})
		.eq("user_id", userId)
		.select()
		.single();

	if (error) {
		console.error("PlantState Update Error:", error);
		return { data: null, error };
	}

	return { data, error: null };
};

/**
 * Increment death_count by 1 (optional).
 */
export const incrementDeathCount = async (userId: string): Promise<ServiceResponse<PlantState>> => {
	const existing = await getPlantState(userId);
	if (existing.error || !existing.data) return existing;

	const newCount = existing.data.death_count + 1;

	return updatePlantState(userId, { death_count: newCount });
};

/**
 * Updates only the fields related to health submission.
 * This wraps updatePlantState so all logic remains centralized.
 */
export async function updatePlantHealth(userId: string, plantHealth: number) {
	const today = new Date().toISOString().slice(0, 10);

	return await updatePlantState(userId, {
		last_submitted_health: plantHealth,
		last_health_update_date: today,
	});
}
