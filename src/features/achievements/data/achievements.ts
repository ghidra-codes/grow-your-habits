import { supabase } from "@/lib/supabase-client";
import type { UserAchievement, UserAchievementInsert } from "@/types/achievement.types";
import type { ServiceResponse } from "@/types/service.types";

/**
 * Fetch all unlocked achievements for a given user.
 */
export const getAchievements = async (userId: string): Promise<ServiceResponse<UserAchievement[]>> => {
	const { data, error } = await supabase.from("user_achievements").select("*").eq("user_id", userId);

	if (error) {
		console.error("User Achievements Fetch Error:", error);
		return { data: null, error };
	}

	return { data: data ?? [], error: null };
};

/**
 * Unlock an achievement for a user.
 */
export const unlockAchievement = async (
	userId: string,
	achievementId: string
): Promise<ServiceResponse<UserAchievement>> => {
	const payload: UserAchievementInsert = {
		user_id: userId,
		achievement_id: achievementId,
	};

	// TRY INSERT
	const { data, error } = await supabase.from("user_achievements").insert(payload).select().single();

	// ON CONFLICT, FETCH EXISTING
	if (error) {
		if (error.code === "23505") {
			const { data: existing, error: existingError } = await supabase
				.from("user_achievements")
				.select("*")
				.eq("user_id", userId)
				.eq("achievement_id", achievementId)
				.single();

			if (existingError) {
				console.error("Achievement Duplication Fetch Error:", existingError);
				return { data: null, error: existingError };
			}

			return { data: existing, error: null };
		}

		console.error("Achievement Unlock Error:", error);
		return { data: null, error };
	}

	return { data, error: null };
};

export const notifyAchievements = async (ids: string[]) => {
	if (!ids?.length) return { data: null, error: null };

	const { data, error } = await supabase
		.from("user_achievements")
		.update({ notified_at: new Date().toISOString() })
		.in("id", ids)
		.select();

	return { data, error };
};
