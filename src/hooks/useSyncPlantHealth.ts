import { updatePlantHealth } from "@/features/plant/data/plant-state";
import { useEffect, useRef } from "react";

const useSyncPlantHealth = (userId: string | null, plantHealth: number | null) => {
	const lastSynced = useRef<number | null>(null);
	const timeout = useRef<number | null>(null);

	useEffect(() => {
		if (!userId) return;
		if (plantHealth === null || plantHealth === undefined) return;

		// Avoid unnecessary writes
		if (lastSynced.current === plantHealth) return;

		if (timeout.current) clearTimeout(timeout.current);

		timeout.current = window.setTimeout(async () => {
			const result = await updatePlantHealth(userId, plantHealth);

			if (!result.error) lastSynced.current = plantHealth;
		}, 1000);

		return () => {
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, [userId, plantHealth]);
};

export default useSyncPlantHealth;
