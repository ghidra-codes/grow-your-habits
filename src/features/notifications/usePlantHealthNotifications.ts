import { useEffect } from "react";
import { useNotificationActions } from "@/store/useNotificationStore";
import { usePlantStateQuery } from "@/features/plant/hooks/queries/usePlantStateQuery";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { usePlantDeathNotification } from "./usePlantDeathNotification";
import { NOTIF_MSG, NOTIF_TYPE } from "./config/notifications";

export const usePlantHealthNotifications = () => {
	const userId = useUserIdRequired();
	const { push } = useNotificationActions();

	const { data } = usePlantStateQuery(userId);

	usePlantDeathNotification(userId);

	useEffect(() => {
		if (!data) return;

		const serverHealth = data.state.last_submitted_health;
		if (serverHealth === undefined || serverHealth === null) return;

		const key = `plant_health_prev_server_${userId}`;
		const stored = localStorage.getItem(key);

		if (stored === null) {
			localStorage.setItem(key, String(serverHealth));
			return;
		}

		const prevServer = Number(stored);

		// THRESHOLD CROSSINGS (SERVER ONLY)

		if (serverHealth <= 20 && prevServer > 20) {
			push(NOTIF_MSG.plant.critical, NOTIF_TYPE.alert, "plant");
		}

		if (serverHealth >= 90 && prevServer < 90) {
			push(NOTIF_MSG.plant.thriving, NOTIF_TYPE.success, "plant");
		}

		// Persist
		localStorage.setItem(key, String(serverHealth));
	}, [data, userId, push]);
};
