import type { HabitLog, HabitLogInsert } from "@/types/habit.types";
import type { ServiceResponse } from "@/types/service.types";
import getTodayDate from "@/utils/helpers/getTodayDate";
import { supabase } from "@/utils/supabase-client";

/*
 * Creates a habit log for the current day.
 */
export const createHabitLog = async (habitId: string, userId: string): Promise<ServiceResponse<HabitLog>> => {
	const today = getTodayDate();

	// Check if a log for today already exists
	const { data: existing, error: existingError } = await supabase
		.from("habit_logs")
		.select("*")
		.eq("habit_id", habitId)
		.eq("user_id", userId)
		.eq("log_date", today)
		.maybeSingle();

	if (existingError) {
		console.error("Habit Log Check Error:", existingError);

		return { data: null, error: existingError };
	}

	// Already logged for today
	if (existing) return { data: existing, error: null };

	// Insert new log
	const insertPayload: HabitLogInsert = {
		habit_id: habitId,
		user_id: userId,
		log_date: today,
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
	userId: string
): Promise<ServiceResponse<HabitLog | null>> => {
	const today = getTodayDate();

	const { data, error } = await supabase
		.from("habit_logs")
		.delete()
		.eq("habit_id", habitId)
		.eq("user_id", userId)
		.eq("log_date", today)
		.select()
		.single();

	if (error) {
		console.error("Habit Log Delete Error:", error);
		return { data: null, error };
	}

	return { data, error: null };
};
