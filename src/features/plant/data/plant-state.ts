import { supabase } from "@/lib/supabase-client";
import type { PlantState, PlantStateInsert, PlantStateUpdate } from "@/types/plant.types";
import type { ServiceResponse } from "@/types/service.types";
import { startOfDay, subDays } from "date-fns";

/**
 * Fetch plant_state row for a specific user.
 */
export const getPlantState = async (userId: string): Promise<ServiceResponse<PlantState>> => {
	const { data, error } = await supabase
		.from("plant_state")
		.select("*")
		.eq("user_id", userId)
		.maybeSingle();

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
		growth_score: 4,
		death_count: 0,
		last_growth_date: null,
		last_submitted_health: 100,
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
 * Increment death_count by 1.
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
export const updatePlantHealth = async (userId: string, plantHealth: number) => {
	const today = new Date().toISOString().slice(0, 10);

	return await updatePlantState(userId, {
		last_submitted_health: plantHealth,
		last_health_update_date: today,
	});
};

/** Returns this week's growth change compared to last week. */
export const getWeeklyGrowthChange = async (userId: string): Promise<number> => {
	const today = startOfDay(new Date());
	const weekStart = subDays(today, 6);
	const lastWeekStart = subDays(today, 13);

	const { data, error } = await supabase
		.from("plant_growth_logs")
		.select("date, growth_score")
		.eq("user_id", userId)
		.gte("date", lastWeekStart.toISOString())
		.lte("date", today.toISOString())
		.order("date", { ascending: true });

	if (error) throw error;

	const thisWeek: number[] = [];
	const lastWeek: number[] = [];

	for (const log of data ?? []) {
		const day = startOfDay(new Date(log.date));

		if (day >= weekStart && day <= today) thisWeek.push(log.growth_score);
		else if (day >= lastWeekStart && day < weekStart) lastWeek.push(log.growth_score);
	}

	const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

	return sum(thisWeek) - sum(lastWeek);
};

/** Returns this month's growth change compared to last month. */
export const getMonthlyGrowthChange = async (userId: string): Promise<number> => {
	const today = startOfDay(new Date());
	const monthStart = subDays(today, 29);
	const lastMonthStart = subDays(today, 59);

	const { data, error } = await supabase
		.from("plant_growth_logs")
		.select("date, growth_score")
		.eq("user_id", userId)
		.gte("date", lastMonthStart.toISOString())
		.lte("date", today.toISOString())
		.order("date", { ascending: true });

	if (error) throw error;

	const thisMonth: number[] = [];
	const lastMonth: number[] = [];

	for (const log of data ?? []) {
		const day = startOfDay(new Date(log.date));

		if (day >= monthStart && day <= today) thisMonth.push(log.growth_score);
		else if (day >= lastMonthStart && day < monthStart) lastMonth.push(log.growth_score);
	}

	const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

	return sum(thisMonth) - sum(lastMonth);
};
