import type {
	Achievement,
	AchievementContext,
	AchievementFilters,
	AchievementUnlockMap,
} from "@/types/achievements.types";
import { useEffect, useMemo, useRef, useState } from "react";
import { ACHIEVEMENT_CONDITIONS } from "../config/achievement-conditions";
import { ACHIEVEMENTS } from "../config/achievements";
import { useUnlockAchievement } from "./mutations/useAchievementUnlock";
import { useUserAchievementsQuery } from "./queries/useAchievementsQuery";

export const useAchievements = (
	userId: string,
	context: AchievementContext,
	filter: AchievementFilters = "all"
) => {
	const { data: unlocked = [], isLoading } = useUserAchievementsQuery(userId);
	const { mutate: unlock } = useUnlockAchievement(userId);

	const [pendingUnlocks, setPendingUnlocks] = useState<string[]>([]);
	const prevContextRef = useRef<AchievementContext | null>(null);

	// FAST LOOKUP
	const unlockedMap: AchievementUnlockMap = useMemo(() => {
		const map: AchievementUnlockMap = {};
		for (const a of unlocked) map[a.achievement_id] = true;
		return map;
	}, [unlocked]);

	// UI
	const achievements: Achievement[] = useMemo(() => {
		return ACHIEVEMENTS.map((def) => {
			const match = unlocked.find((a) => a.achievement_id === def.id);
			return {
				...def,
				unlocked: !!match,
				unlockedAt: match?.unlocked_at ?? null,
			};
		});
	}, [unlocked]);

	const filteredAchievements = useMemo(() => {
		if (filter === "all") return achievements;
		if (filter === "unlocked") return achievements.filter((a) => a.unlocked);
		if (filter === "locked") return achievements.filter((a) => !a.unlocked);
		return achievements.filter((a) => a.type === filter);
	}, [achievements, filter]);

	// DETECT NEW UNLOCKS
	useEffect(() => {
		if (isLoading) return;

		const previous = prevContextRef.current;
		const nextUnlocks: string[] = [];

		for (const def of ACHIEVEMENTS) {
			if (unlockedMap[def.id]) continue;

			const condition = ACHIEVEMENT_CONDITIONS[def.id];

			if (def.id === "achievement_collector") {
				const allFinished = ACHIEVEMENTS.filter((a) => a.id !== "achievement_collector").every(
					(a) => unlockedMap[a.id] || ACHIEVEMENT_CONDITIONS[a.id](context)
				);

				if (allFinished) nextUnlocks.push(def.id);
				continue;
			}

			const now = condition(context);
			const before = previous ? condition(previous) : false;

			if (!before && now) nextUnlocks.push(def.id);
		}

		if (nextUnlocks.length > 0) queueMicrotask(() => setPendingUnlocks(nextUnlocks));

		prevContextRef.current = context;
	}, [context, unlockedMap, isLoading]);

	// TRIGGER UNLOCKS
	useEffect(() => {
		if (pendingUnlocks.length === 0) return;

		for (const id of pendingUnlocks) unlock(id);

		queueMicrotask(() => setPendingUnlocks([]));
	}, [pendingUnlocks, unlock]);

	return {
		achievements: filteredAchievements,
		pendingUnlocks,
		unlockedMap,
		isLoading,
	};
};
