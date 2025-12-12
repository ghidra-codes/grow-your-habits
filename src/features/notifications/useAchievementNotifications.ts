import useAchievementsNotify from "@/features/achievements/hooks/mutations/useAchievementsNotify";
import { useAchievementContext } from "@/features/achievements/hooks/useAchievementContext";
import { useAchievements } from "@/features/achievements/hooks/useAchievements";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useNotificationActions } from "@/store/useNotificationStore";
import { useEffect, useRef } from "react";
import { NOTIF_MSG, NOTIF_TYPE } from "./config/notifications";
import type { Achievement } from "@/types/achievement.types";

type NotifiableAchievement = {
	entryId: string;
	title: string;
};

export const useAchievementNotifications = () => {
	const userId = useUserIdRequired();
	const { push } = useNotificationActions();

	const context = useAchievementContext(userId);
	const { achievements } = useAchievements(userId, context);

	const { mutate } = useAchievementsNotify(userId);

	const notifiedRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (!achievements) return;

		const toNotify: NotifiableAchievement[] = achievements
			.filter(
				(a): a is Achievement & { entryId: string } =>
					a.unlocked && !a.notifiedAt && typeof a.entryId === "string"
			)
			.map((a) => ({ entryId: a.entryId, title: a.title }));

		if (toNotify.length === 0) return;

		const fresh = toNotify.filter((a) => {
			if (notifiedRef.current.has(a.entryId)) return false;
			notifiedRef.current.add(a.entryId);
			return true;
		});

		if (fresh.length === 0) return;

		for (const a of fresh) push(NOTIF_MSG.achievements(a.title), NOTIF_TYPE.success, "achievement");

		const ids = fresh.map((a) => a.entryId);

		mutate(ids);
	}, [achievements, push, mutate]);
};
