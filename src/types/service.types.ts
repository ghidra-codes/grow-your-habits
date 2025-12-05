import { type PostgrestError } from "@supabase/supabase-js";
import type { HabitWithLogs } from "./habit.types";

/**
 * Standardized response structure for all data service functions (DB/API).
 * Ensures consistency in error handling across the application.
 */
export interface ServiceResponse<T> {
	data: T | null;
	error: PostgrestError | null;
}

// Habit logs
export type LogVars = { habitId: string; date: string };
export type LogCtx = { prevHabits?: HabitWithLogs[] };
