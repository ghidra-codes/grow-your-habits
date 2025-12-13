import type { FrequencyType, Habit } from "@/types/habit.types";
import type { ServiceResponse } from "@/types/service.types";
import { normalizeHabit, normalizeHabitWithLogs } from "@/lib/habits";
import { supabase } from "@/lib/supabase/supabase-client";

/**
 * Fetches all habits, their logs and for the for a given user ID.
 */
export const getHabits = async (userId: string) => {
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
			habit_logs!left (
				id,
				log_date
			)
		`
		)
		.eq("user_id", userId);

	if (error) return { data: null, error };

	return { data: data?.map(normalizeHabitWithLogs), error: null };
};

/**
 * Inserts a new habit record into the database.
 */
export const addHabit = async (
	name: string,
	userId: string,
	description: string,
	frequency_type: FrequencyType,
	target_per_week: number | null,
	target_per_month: number | null
): Promise<ServiceResponse<Habit>> => {
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
		.select()
		.single();

	if (error) {
		console.error("Habits DB Insertion Error:", error);
		return { data: null, error };
	}

	return { data: normalizeHabit(data), error };
};

/*
 * Updates an existing habit by its ID.
 */
export const updateHabit = async (
	habitId: string,
	name: string,
	description: string,
	frequency_type: FrequencyType,
	target_per_week: number | null,
	target_per_month: number | null
): Promise<ServiceResponse<Habit>> => {
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
		.select()
		.single();

	if (error) return { data: null, error };

	return { data: normalizeHabit(data), error: null };
};

/*
 * Deletes a habit by its ID.
 */
export const deleteHabit = async (habitId: string): Promise<ServiceResponse<Habit[]>> => {
	const { data, error } = await supabase.from("habits").delete().select().eq("id", habitId);

	if (error) {
		console.error("Habits DB Deletion Error:", error);
		return { data: null, error };
	}

	return { data: (data ?? []).map(normalizeHabit), error: null };
};

/**
 * Returns true if the user has ever created a habit.
 * Used to determine whether the plant should be initialized.
 */
export const checkHasHadHabits = async (userId: string): Promise<boolean> => {
	const { data, error } = await supabase
		.from("habits")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId);

	if (error) {
		console.error("Failed to check existing habits:", error);
		return false;
	}

	return (data?.length ?? 0) > 0;
};
