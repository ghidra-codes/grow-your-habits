import { useEffect } from "react";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { useStatsStreakMap } from "@/features/statistics/hooks/useStatsStreakMap";
import { useNotificationActions } from "@/store/useNotificationStore";
import { NOTIF_MSG, NOTIF_TYPE, STREAK_THRESHOLDS, STREAK_UNITS } from "./config/notifications";

const useStreakNotifications = () => {
	const userId = useUserIdRequired();
	const { data: habits = [] } = useHabitsQuery(userId);
	const streakMap = useStatsStreakMap(habits);

	const { open } = useNotificationActions();

	useEffect(() => {
		if (!habits.length) return;

		const prevKey = `streak_prev_${userId}`;
		const notifiedKey = `streak_notified_${userId}`;

		// Load persisted maps
		const prevRaw = localStorage.getItem(prevKey);
		const notifiedRaw = localStorage.getItem(notifiedKey);

		const prevMap: Record<string, number> = prevRaw ? JSON.parse(prevRaw) : {};
		const notifiedMap: Record<string, boolean> = notifiedRaw ? JSON.parse(notifiedRaw) : {};

		// Process habits
		for (const habit of habits) {
			const habitId = habit.id;
			const freq = habit.frequency_type;

			const current = streakMap[habitId]?.currentStreak ?? 0;
			const previous = prevMap[habitId] ?? 0;
			const hasBeenNotified = notifiedMap[habitId] ?? false;

			const threshold = STREAK_THRESHOLDS[freq];
			const unit = STREAK_UNITS[freq];

			// Fire notification only when streak increased and threshold met
			if (current > previous && current >= threshold && !hasBeenNotified) {
				open(NOTIF_MSG.streak(current, unit), NOTIF_TYPE.success);
				notifiedMap[habitId] = true;
			}

			// Update previous streak
			prevMap[habitId] = current;
		}

		// Persist updated maps
		localStorage.setItem(prevKey, JSON.stringify(prevMap));
		localStorage.setItem(notifiedKey, JSON.stringify(notifiedMap));
	}, [habits, streakMap, userId, open]);
};

export default useStreakNotifications;
