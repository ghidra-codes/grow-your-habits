import { updatePlantHealth } from "@/features/plant/data/plant-state";
import { plantStateKey } from "@/lib/data/queryKeys";
import { getPlantStageFromGrowth } from "@/lib/plant";
import type { PlantEntry, PlantState } from "@/types/plant.types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useIncrementDeathCount } from "../mutations/useIncrementDeathCount";

export const useSyncPlantHealth = (
	userId: string,
	plantHealth: number,
	calculated: number,
	isInitialized: boolean,
	notifyDeath: () => void
) => {
	const queryClient = useQueryClient();
	const incrementDeath = useIncrementDeathCount(userId);

	const lastSyncedRef = useRef<number | null>(null);
	const prevCalculatedRef = useRef<number>(0);
	const timeoutRef = useRef<number | null>(null);

	const queryKey = plantStateKey(userId);

	// HELPERS

	const setPlantCache = useCallback(
		(state: PlantState) => {
			queryClient.setQueryData<PlantEntry>(queryKey, {
				state,
				stage: getPlantStageFromGrowth(state.growth_score),
				isInitialized: true,
			});
		},
		[queryClient, queryKey]
	);

	const persistHealth = useCallback(
		async (health: number) => {
			const res = await updatePlantHealth(userId, health);
			if (res.error || !res.data) return;

			lastSyncedRef.current = res.data.last_submitted_health ?? health;
			setPlantCache(res.data);

			localStorage.setItem(`death_count_${userId}`, String(res.data.death_count ?? 0));
		},
		[userId, setPlantCache]
	);

	// EFFECTS

	useEffect(() => {
		if (!isInitialized) return;

		const cached = queryClient.getQueryData<PlantEntry>(queryKey);

		const serverHealth = cached?.state.last_submitted_health ?? 0;
		const rawCalculated = calculated;
		const next = plantHealth;

		// INITIALIZE BASELINES

		if (lastSyncedRef.current === null) lastSyncedRef.current = serverHealth;

		if (
			cached?.state.last_submitted_health !== undefined &&
			lastSyncedRef.current !== cached.state.last_submitted_health
		) {
			lastSyncedRef.current = cached.state.last_submitted_health;
		}

		if (prevCalculatedRef.current === 0 && serverHealth > 0) prevCalculatedRef.current = rawCalculated;

		const prevServerHealth = lastSyncedRef.current ?? serverHealth;
		lastSyncedRef.current = serverHealth;

		// DEATH DETECTION

		if (prevServerHealth > 0 && serverHealth === 0) {
			notifyDeath();

			incrementDeath.mutate(undefined, {
				onSuccess: (updated) => {
					if (updated) setPlantCache(updated);
				},
			});

			// HARD-SYNC SERVER TO 0 JUST IN CASE
			void persistHealth(0);
			return;
		}

		// REVIVAL DETECTION

		const prevCalculated = prevCalculatedRef.current;
		prevCalculatedRef.current = rawCalculated;

		const calculatedIncreased = rawCalculated > prevCalculated;

		if (serverHealth === 0 && rawCalculated > 0 && calculatedIncreased) {
			void persistHealth(rawCalculated);
			return;
		}

		// NO CHANGE
		if (prevServerHealth === next) return;

		// NORMAL SYNC (DEBOUNCED)
		if (timeoutRef.current) clearTimeout(timeoutRef.current);

		timeoutRef.current = window.setTimeout(() => {
			void persistHealth(next);
		}, 700);

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [
		queryClient,
		queryKey,
		userId,
		plantHealth,
		calculated,
		isInitialized,
		incrementDeath,
		notifyDeath,
		persistHealth,
		setPlantCache,
	]);
};
