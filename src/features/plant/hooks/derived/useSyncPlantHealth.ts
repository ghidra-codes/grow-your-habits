import { updatePlantHealth, updatePlantState } from "@/features/plant/data/plant-state";
import { useEffect, useRef } from "react";
import { useIncrementDeathCount } from "../mutations/useIncrementDeathCount";

const useSyncPlantHealth = (userId: string, plantHealth: number, isInitialized: boolean) => {
	const lastSynced = useRef<number | null>(null);
	const timeout = useRef<number | null>(null);

	const incrementDeath = useIncrementDeathCount(userId);

	useEffect(() => {
		if (!isInitialized) return;

		const prev = lastSynced.current;
		const next = plantHealth;

		if (prev !== null && prev > 0 && next === 0) {
			incrementDeath.mutate();
			updatePlantState(userId, { growth_score: 0, last_growth_date: null });
		}

		if (prev === next) return;

		if (timeout.current) clearTimeout(timeout.current);

		timeout.current = window.setTimeout(async () => {
			const result = await updatePlantHealth(userId, next);
			if (!result.error) lastSynced.current = next;
		}, 1000);

		return () => {
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, [userId, plantHealth, incrementDeath, isInitialized]);
};

export default useSyncPlantHealth;
