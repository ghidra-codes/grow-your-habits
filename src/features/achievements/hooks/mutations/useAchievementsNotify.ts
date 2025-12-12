import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifyAchievements } from "../../data/achievements";
import { achievementsKey } from "@/lib/helpers/queryKeys";

const useAchievementsNotify = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notifyAchievements,
		retry: 5,
		retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 20000),

		onSuccess: () => queryClient.invalidateQueries({ queryKey: achievementsKey(userId) }),
		onError: (error) => console.error("Failed to mark achievements as notified", error),
	});
};
export default useAchievementsNotify;
