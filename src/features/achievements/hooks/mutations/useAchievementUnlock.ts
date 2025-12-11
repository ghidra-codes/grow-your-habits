import { useMutation, useQueryClient } from "@tanstack/react-query";
import { achievementsKey } from "@/lib/helpers/queryKeys";
import type { UserAchievement } from "@/types/achievement.types";
import { unlockAchievement } from "../../data/achievements";

export const useUnlockAchievement = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (achievementId: string) => {
			const { data, error } = await unlockAchievement(userId, achievementId);

			if (error) throw new Error(error.message);

			return data;
		},

		onMutate: async (achievementId: string) => {
			const key = achievementsKey(userId);

			await queryClient.cancelQueries({ queryKey: key });

			const prev = queryClient.getQueryData<UserAchievement[]>(key) || [];

			const alreadyUnlocked = prev.some((a) => a.achievement_id === achievementId);

			if (!alreadyUnlocked) {
				const optimistic: UserAchievement = {
					id: `temp-${Date.now()}`,
					user_id: userId,
					achievement_id: achievementId,
					unlocked_at: new Date().toISOString(),
					notified_at: null,
				};

				queryClient.setQueryData(key, [...prev, optimistic]);
			}

			return { prev };
		},

		onError: (_err, _vars, ctx) => {
			if (ctx?.prev) {
				queryClient.setQueryData(achievementsKey(userId), ctx.prev);
			}
		},

		onSuccess: (savedAchievement) => {
			if (!savedAchievement) return;

			queryClient.setQueryData<UserAchievement[]>(achievementsKey(userId), (prev = []) => {
				const filtered = prev.filter((a) => !a.id.startsWith("temp-"));
				return [...filtered, savedAchievement];
			});
		},
	});
};
