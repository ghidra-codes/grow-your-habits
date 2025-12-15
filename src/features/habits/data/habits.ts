import type { FrequencyType, HabitWithLogs } from "@/types/habit.types";
import type { ServiceResponse } from "@/types/service.types";
import { normalizeHabitWithLogs } from "@/lib/habits";
import { supabase } from "@/lib/supabase/supabase-client";

/**
 * Fetches all habits and their logs for a given user ID.
 */
export const getHabits = async (userId: string): Promise<ServiceResponse<HabitWithLogs[]>> => {
	const { data, error } = await supabase
		.from("habits")
		.select(
			`
			id,
			name,
			created_at,
			user_id,
			description,
			frequency_type,
			target_per_week,
			target_per_month,
			habit_logs (
				id,
				log_date
			)
		`
		)
		.eq("user_id", userId);

	if (error) return { data: null, error };

	return {
		data: data.map(normalizeHabitWithLogs),
		error: null,
	};
};

/**
 * Inserts a new habit record and returns it with logs.
 */
export const addHabit = async (
	name: string,
	userId: string,
	description: string,
	frequency_type: FrequencyType,
	target_per_week: number | null,
	target_per_month: number | null
): Promise<ServiceResponse<HabitWithLogs>> => {
	const { data, error } = await supabase
		.from("habits")
		.insert({
			name,
			user_id: userId,
			description,
			frequency_type,
			target_per_week,
			target_per_month,
		})
		.select(
			`
			id,
			name,
			created_at,
			user_id,
			description,
			frequency_type,
			target_per_week,
			target_per_month,
			habit_logs (
				id,
				log_date
			)
		`
		)
		.single();

	if (error) return { data: null, error };

	return {
		data: normalizeHabitWithLogs(data),
		error: null,
	};
};

/**
 * Updates an existing habit and returns it with logs.
 */
export const updateHabit = async (
	habitId: string,
	name: string,
	description: string,
	frequency_type: FrequencyType,
	target_per_week: number | null,
	target_per_month: number | null
): Promise<ServiceResponse<HabitWithLogs>> => {
	const { data, error } = await supabase
		.from("habits")
		.update({
			name,
			description,
			frequency_type,
			target_per_week,
			target_per_month,
		})
		.eq("id", habitId)
		.select(
			`
			id,
			name,
			created_at,
			user_id,
			description,
			frequency_type,
			target_per_week,
			target_per_month,
			habit_logs (
				id,
				log_date
			)
		`
		)
		.single();

	if (error) return { data: null, error };

	return {
		data: normalizeHabitWithLogs(data),
		error: null,
	};
};

/**
 * Deletes a habit by its ID.
 */
export const deleteHabit = async (habitId: string): Promise<ServiceResponse<null>> => {
	const { error } = await supabase.from("habits").delete().eq("id", habitId);

	if (error) return { data: null, error };

	return { data: null, error: null };
};

/**
 * Returns true if the user has ever created a habit.
 * Used to determine whether the plant should be initialized.
 */
export const checkHasHadHabits = async (userId: string): Promise<boolean> => {
	const { count, error } = await supabase
		.from("habits")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId);

	if (error) {
		console.error("Failed to check existing habits:", error);
		return false;
	}

	return (count ?? 0) > 0;
};
