import { useMutation, useQueryClient } from "@tanstack/react-query";
import { achievementsKey } from "@/lib/helpers/queryKeys";
import { unlockAchievement } from "../../data/achievements";

export const useUnlockAchievement = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (achievementId: string) => {
			const { data, error } = await unlockAchievement(userId, achievementId);
			if (error) throw new Error(error.message);
			return data;
		},

		onSuccess: () => queryClient.invalidateQueries({ queryKey: achievementsKey(userId) }),
	});
};
