import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { useStatsStreakMap } from "@/features/statistics/hooks/useStatsStreakMap";
import { useNotificationActions } from "@/store/useNotificationStore";
import type { StreakTier } from "@/types/notification.types";
import { useEffect } from "react";
import { NOTIF_MSG, NOTIF_TYPE, STREAK_TIERS, STREAK_UNITS } from "./config/notifications";

export const useStreakNotifications = () => {
	const userId = useUserIdRequired();
	const { data: habits = [] } = useHabitsQuery(userId);
	const streakMap = useStatsStreakMap(habits);

	const { push } = useNotificationActions();

	useEffect(() => {
		if (!habits.length) return;

		const prevKey = `streak_prev_${userId}`;
		const notifiedKey = `streak_notified_${userId}`;

		const prevMap: Record<string, number> = JSON.parse(localStorage.getItem(prevKey) ?? "{}");

		const notifiedMap: Record<string, number[]> = JSON.parse(localStorage.getItem(notifiedKey) ?? "{}");

		for (const habit of habits) {
			const habitId = habit.id;
			const freq = habit.frequency_type;

			const current = streakMap[habitId]?.currentStreak ?? 0;
			const previous = prevMap[habitId] ?? 0;

			// Reset tiers if streak breaks
			if (current === 0) notifiedMap[habitId] = [];

			const unit = STREAK_UNITS[freq];
			let notifiedTiers = Array.isArray(notifiedMap[habitId]) ? notifiedMap[habitId] : [];

			if (current === 0) notifiedTiers = [];

			notifiedMap[habitId] = notifiedTiers;

			for (const tier of STREAK_TIERS) {
				const tierKey = tier as StreakTier;

				const crossedTier = previous < tier && current >= tier && !notifiedTiers.includes(tier);

				if (!crossedTier) continue;

				// Send notification and mark tier as notified
				push(NOTIF_MSG.streak[tierKey](current, unit), NOTIF_TYPE.success, "streak");

				notifiedTiers.push(tier);
			}

			prevMap[habitId] = current;
		}

		localStorage.setItem(prevKey, JSON.stringify(prevMap));
		localStorage.setItem(notifiedKey, JSON.stringify(notifiedMap));
	}, [habits, streakMap, userId, push]);
};
