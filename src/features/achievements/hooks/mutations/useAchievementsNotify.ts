import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifyAchievements } from "../../data/achievements";
import { achievementsKey } from "@/lib/helpers/queryKeys";
import type { UserAchievement } from "@/types/achievement.types";

const useAchievementsNotify = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notifyAchievements,
		retry: 5,
		retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 20000),

		onSuccess: (_res, ids: string[]) => {
			queryClient.setQueryData<UserAchievement[] | undefined>(achievementsKey(userId), (prev) => {
				if (!prev) return prev;

				const now = new Date().toISOString();
				return prev.map((row) => (ids.includes(row.id) ? { ...row, notified_at: now } : row));
			});
		},

		onError: (error) => {
			console.error("Failed to mark achievements as notified", error);
		},
	});
};
export default useAchievementsNotify;
