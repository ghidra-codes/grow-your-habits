import type { FrequencyType, Habit } from "@/types/habit.types";
import type { ServiceResponse } from "@/types/service.types";
import { normalizeHabit, normalizeHabitWithLogs } from "@/utils/helpers/normalizeHabit";
import { supabase } from "@/utils/supabase-client";

/**
 * Fetches all habits and their logs for the day for a given user ID.
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
			),
			habit_schedule!left (
				weekday
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
	frequency_type: "daily" | "weekly" | "monthly" | "custom",
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
