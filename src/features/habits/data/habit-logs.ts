import type { HabitLog, HabitLogInsert } from "@/types/habit.types";
import type { ServiceResponse } from "@/types/service.types";
import { supabase } from "@/lib/supabase-client";

/*
 * Creates a habit log for the current day.
 */
export const createHabitLog = async (
	habitId: string,
	userId: string,
	date: string
): Promise<ServiceResponse<HabitLog>> => {
	// Check if a log for that exact date exists
	const { data: existing, error: existingError } = await supabase
		.from("habit_logs")
		.select("*")
		.eq("habit_id", habitId)
		.eq("user_id", userId)
		.eq("log_date", date)
		.maybeSingle();

	if (existingError) {
		console.error("Habit Log Check Error:", existingError);
		return { data: null, error: existingError };
	}

	if (existing) return { data: existing, error: null };

	// Insert with the *passed* date (NOT today)
	const insertPayload: HabitLogInsert = {
		habit_id: habitId,
		user_id: userId,
		log_date: date,
		value: 1,
	};

	const { data, error } = await supabase.from("habit_logs").insert(insertPayload).select().single();

	if (error) {
		console.error("Habit Log Insert Error:", error);
		return { data: null, error };
	}

	return { data, error: null };
};

/*
 * Deletes a habit log for the current day.
 */
export const deleteHabitLog = async (
	habitId: string,
	userId: string,
	date: string
): Promise<ServiceResponse<HabitLog | null>> => {
	const { data, error } = await supabase
		.from("habit_logs")
		.delete()
		.eq("habit_id", habitId)
		.eq("user_id", userId)
		.eq("log_date", date)
		.select()
		.single();

	if (error) {
		console.error("Habit Log Delete Error:", error);
		return { data: null, error };
	}

	return { data, error: null };
};
