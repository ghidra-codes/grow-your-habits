import { supabase } from "@/lib/supabase/supabase-client";
import type { PlantState, PlantStateInsert, PlantStateUpdate } from "@/types/plant.types";
import type { ServiceResponse } from "@/types/service.types";
import { startOfDay, subDays } from "date-fns";

const getDailyGrowthAmount = (health: number): number => {
	if (health < 10) return 0;
	return Math.round(1 + health / 20);
};

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
 * Creates the plant_state row for a user if missing.
 * Uses upsert to avoid duplicate-key race conditions.
 */
export const initPlantState = async (userId: string): Promise<ServiceResponse<PlantState>> => {
	const payload: PlantStateInsert = {
		user_id: userId,
		growth_score: 4,
		death_count: 0,
		last_growth_date: null,
		last_submitted_health: 50,
		last_health_update_date: startOfDay(new Date()).toISOString(),
	};

	// Use upsert to avoid duplicate key constraint if two requests run concurrently.
	const { data, error } = await supabase
		.from("plant_state")
		.upsert(payload, { onConflict: "user_id" })
		.select()
		.single();

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
 * Updates only the fields related to health submission.
 * This wraps updatePlantState so all logic remains centralized.
 *
 * Revival logic: when prev health === 0 and newHealth > 0, we add daily growth.
 */
export const updatePlantHealth = async (
	userId: string,
	newHealth: number
): Promise<ServiceResponse<PlantState>> => {
	const { data: existing, error: existingErr } = await supabase
		.from("plant_state")
		.select("*")
		.eq("user_id", userId)
		.maybeSingle();

	if (existingErr) {
		console.error("Failed to load plant_state for updatePlantHealth:", existingErr);
		return { data: null, error: existingErr };
	}

	// IF MISSING, CREATE INITIAL ROW (use upsert to be safe)
	if (!existing) {
		const payload = {
			user_id: userId,
			growth_score: 0,
			death_count: 0,
			last_growth_date: null,
			last_submitted_health: newHealth,
			last_health_update_date: startOfDay(new Date()).toISOString(),
		};
		const { data: init, error: initErr } = await supabase
			.from("plant_state")
			.upsert(payload, { onConflict: "user_id" })
			.select()
			.single();

		if (initErr) {
			console.error("init (upsert) failed in updatePlantHealth:", initErr);
			return { data: null, error: initErr };
		}

		return { data: init, error: null };
	}

	const prevHealth = existing.last_submitted_health ?? 0;
	const prevGrowth = existing.growth_score ?? 0;

	const updates: Partial<PlantState> = {
		last_submitted_health: newHealth,
		last_health_update_date: startOfDay(new Date()).toISOString(),
		updated_at: new Date().toISOString(),
	};

	// REVIVAL CASE: prevHealth === 0 && newHealth > 0
	if (prevHealth === 0 && newHealth > 0) {
		const gain = getDailyGrowthAmount(newHealth);
		updates.growth_score = prevGrowth + gain;
		updates.last_growth_date = startOfDay(new Date()).toISOString();
	}

	const { data, error } = await supabase
		.from("plant_state")
		.update(updates)
		.eq("user_id", userId)
		.select()
		.single();

	if (error) {
		console.error("updatePlantHealth error:", error);
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
 * Returns this week's growth change compared to last week.
 */
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

/**
 * Returns this month's growth change compared to last month.
 */
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
