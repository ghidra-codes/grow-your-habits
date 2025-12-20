import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { usePlantStateQuery } from "@/features/plant/hooks/queries/usePlantStateQuery";
import { getHealthBand } from "@/lib/plant/health/getHealthBand";
import { isHealthBand } from "@/lib/plant/health/isHealthBand";
import { useNotificationActions } from "@/store/useNotificationStore";
import type { PlantHealthThresholds } from "@/types/plant.types";
import { useEffect } from "react";
import { NOTIF_MSG, NOTIF_TYPE } from "./config/notifications";
import { usePlantDeathNotification } from "./usePlantDeathNotification";

export const usePlantHealthNotifications = () => {
	const userId = useUserIdRequired();
	const { push } = useNotificationActions();

	const { data } = usePlantStateQuery(userId);

	usePlantDeathNotification(userId);

	const BAND_KEY = `plant_health_band_${userId}`;

	useEffect(() => {
		if (!data) return;

		const serverHealth = data.state.last_submitted_health;
		if (serverHealth == null) return;

		const currentBand = getHealthBand(serverHealth);

		const storedRaw = localStorage.getItem(BAND_KEY);
		const storedBand: PlantHealthThresholds | null = isHealthBand(storedRaw) ? storedRaw : null;

		if (!storedBand) {
			localStorage.setItem(BAND_KEY, currentBand);
			return;
		}

		if (storedBand === currentBand) return;

		// THRESHOLD CROSSINGS (SERVER ONLY)

		if (currentBand === "critical") push(NOTIF_MSG.plant.critical, NOTIF_TYPE.alert, "plant");

		if (currentBand === "thriving") push(NOTIF_MSG.plant.thriving, NOTIF_TYPE.success, "plant");

		// Persist
		localStorage.setItem(BAND_KEY, currentBand);
	}, [data, userId, push, BAND_KEY]);
};
