import { useQuery } from "@tanstack/react-query";
import { achievementsKey } from "@/lib/helpers/queryKeys";
import type { UserAchievement } from "@/types/achievement.types";
import { getAchievements } from "../../data/achievements";

export const useAchievementsQuery = (userId: string) =>
	useQuery<UserAchievement[]>({
		queryKey: achievementsKey(userId),

		queryFn: async () => {
			const { data, error } = await getAchievements(userId);

			if (error) throw new Error(error.message);

			return data ?? [];
		},

		refetchOnMount: false,
		refetchOnWindowFocus: false,
		retry: 1,
	});
