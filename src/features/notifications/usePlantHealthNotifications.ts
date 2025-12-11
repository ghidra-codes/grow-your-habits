import { useEffect } from "react";
import { useNotificationActions } from "@/store/useNotificationStore";
import { usePlantHealth } from "@/features/plant/hooks/derived/usePlantHealth";
import { usePlantStateQuery } from "@/features/plant/hooks/queries/usePlantStateQuery";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { usePlantDeathNotification } from "./usePlantDeathNotification";
import { NOTIF_MSG, NOTIF_TYPE } from "./config/notifications";

export const usePlantHealthNotifications = () => {
	const userId = useUserIdRequired();
	const { open } = useNotificationActions();

	const health = usePlantHealth();
	const { data } = usePlantStateQuery(userId);

	usePlantDeathNotification(userId);

	useEffect(() => {
		if (!data) return;
		if (health === 0) return;

		const key = `plant_health_prev_${userId}`;
		let prev = localStorage.getItem(key);

		if (prev === null) {
			prev = String(data.state.last_submitted_health ?? health);
			localStorage.setItem(key, prev);
		}

		const prevNum = Number(prev);

		// Notifications based on thresholds

		if (health <= 20 && prevNum > 20) open(NOTIF_MSG.plant.critical, NOTIF_TYPE.alert);

		if (prevNum <= 20 && health > 20) open(NOTIF_MSG.plant.recovering, NOTIF_TYPE.success);

		if (health >= 90 && prevNum < 90) open(NOTIF_MSG.plant.thriving, NOTIF_TYPE.success);

		localStorage.setItem(key, String(health));
	}, [health, data, userId, open]);
};
