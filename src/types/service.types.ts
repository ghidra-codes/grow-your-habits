import { type PostgrestError } from "@supabase/supabase-js";

/**
 * Standardized response structure for all data service functions (DB/API).
 * Ensures consistency in error handling across the application.
 */
export interface ServiceResponse<T> {
	data: T | null;
	error: PostgrestError | null;
}
