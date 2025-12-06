import { useQuery } from "@tanstack/react-query";
import { achievementsKey } from "@/lib/helpers/queryKeys";
import type { UserAchievement } from "@/types/achievements.types";
import { getUserAchievements } from "../../data/achievements";

export const useUserAchievementsQuery = (userId: string) =>
	useQuery<UserAchievement[]>({
		queryKey: achievementsKey(userId),

		queryFn: async () => {
			const { data, error } = await getUserAchievements(userId);

			if (error) throw new Error(error.message);

			return data ?? [];
		},

		refetchOnMount: false,
		refetchOnWindowFocus: false,
		retry: 1,
	});
