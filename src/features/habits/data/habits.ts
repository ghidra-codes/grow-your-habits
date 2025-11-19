import type { Habit } from "@/types/habit.types";
import type { ServiceResponse } from "@/types/service.types";
import { supabase } from "@/utils/supabase-client";

/**
 * Fetches all habits for a given user ID.
 */
export const getHabits = async (userId: string): Promise<ServiceResponse<Habit[]>> => {
	const { data, error } = await supabase
		.from("habits")
		.select("id, name, created_at, user_id, description, is_active")
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
	const { data, error } = await supabase
		.from("habits")
		.insert({ name, user_id: userId, description })
		.select()
		.single();

	if (error) {
		console.error("Habits DB Insertion Error:", error);
		return { data: null, error };
	}

	return { data, error };
};
