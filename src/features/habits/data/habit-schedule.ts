import type { ServiceResponse } from "@/types/service.types";
import { supabase } from "@/utils/supabase-client";

/*
 * Fetches habit schedule for a specific habit.
 */
export const getHabitSchedule = async (habitId: string): Promise<ServiceResponse<number[]>> => {
	const { data, error } = await supabase.from("habit_schedule").select("weekday").eq("habit_id", habitId);

	if (error) return { data: null, error };

	return { data: (data ?? []).map((row) => row.weekday), error: null };
};
