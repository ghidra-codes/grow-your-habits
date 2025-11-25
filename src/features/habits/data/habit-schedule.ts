import type { ServiceResponse } from "@/types/service.types";
import { supabase } from "@/utils/supabase-client";

export const getAllHabitSchedules = async (userId: string) => {
	const { data, error } = await supabase
		.from("habit_schedule")
		.select(
			`
			habit_id,
			weekday,
			habits!inner(user_id)
		`
		)
		.eq("habits.user_id", userId);

	if (error) return { data: null, error };

	return {
		data: data.map(({ habit_id, weekday }) => ({ habit_id, weekday })),
		error: null,
	};
};

export const getHabitSchedule = async (habitId: string): Promise<ServiceResponse<number[]>> => {
	const { data, error } = await supabase.from("habit_schedule").select("weekday").eq("habit_id", habitId);

	if (error) return { data: null, error };

	return { data: (data ?? []).map((row) => row.weekday), error: null };
};
