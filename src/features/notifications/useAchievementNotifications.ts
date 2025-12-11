import useAchievementsNotify from "@/features/achievements/hooks/mutations/useAchievementsNotify";
import { useAchievementContext } from "@/features/achievements/hooks/useAchievementContext";
import { useAchievements } from "@/features/achievements/hooks/useAchievements";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useNotificationActions } from "@/store/useNotificationStore";
import { useEffect } from "react";
import { NOTIF_MSG, NOTIF_TYPE } from "./config/notifications";

export const useAchievementNotifications = () => {
	const userId = useUserIdRequired();
	const { open } = useNotificationActions();

	const context = useAchievementContext(userId);
	const { achievements } = useAchievements(userId, context);

	const { mutate } = useAchievementsNotify(userId);

	useEffect(() => {
		if (!achievements) return;

		const toNotify = achievements.filter((a) => a.unlocked && !a.notifiedAt);
		if (toNotify.length === 0) return;

		// Show toast for each
		for (const a of toNotify) {
			open(NOTIF_MSG.achievements(a.title), NOTIF_TYPE.success);
		}

		// Mark notified
		const ids = toNotify.map((a) => a.entryId).filter((id): id is string => Boolean(id));
		if (ids.length === 0) return;

		mutate(ids);
	}, [achievements, open, mutate]);
};
