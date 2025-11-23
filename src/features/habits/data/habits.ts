import type { Habit } from "@/types/habit.types";
import type { ServiceResponse } from "@/types/service.types";
import { supabase } from "@/utils/supabase-client";

/**
 * Fetches all habits for a given user ID.
 */
export const getHabits = async (userId: string): Promise<ServiceResponse<Habit[]>> => {
	const { data, error } = await supabase
		.from("habits")
		.select(
			"id, name, created_at, user_id, description, frequency_type, target_per_week, target_per_month"
		)
		.eq("user_id", userId);

	if (error) console.error("Habits DB Error:", error);

	return { data, error };
};

/**
 * Inserts a new habit record into the database.
 */
export const addHabit = async (
	name: string,
	userId: string,
	description: string
): Promise<ServiceResponse<Habit>> => {
	const frequency_type = "daily";

	const defaults = {
		daily: { target_per_week: null, target_per_month: null },
		weekly: { target_per_week: 3, target_per_month: null },
		monthly: { target_per_week: null, target_per_month: 10 },
		custom: { target_per_week: null, target_per_month: null },
	}[frequency_type];

	const { data, error } = await supabase
		.from("habits")
		.insert({
			name,
			user_id: userId,
			description,
			frequency_type,
			...defaults,
		})
		.select()
		.single();

	if (error) {
		console.error("Habits DB Insertion Error:", error);
		return { data: null, error };
	}

	return { data, error };
};

/*
 * Updates an existing habit by its ID.
 */
export const updateHabit = async (
	habitId: string,
	name: string,
	description: string
): Promise<ServiceResponse<Habit>> => {
	const { data, error } = await supabase
		.from("habits")
		.update({ name, description })
		.eq("id", habitId)
		.select()
		.single();

	if (error) {
		console.error("Habits DB Update Error:", error);
		return { data: null, error };
	}

	return { data, error };
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

	return { data, error: null };
};
