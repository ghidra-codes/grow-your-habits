import { useEffect } from "react";
import { usePlantStateQuery } from "@/features/plant/hooks/queries/usePlantStateQuery";
import { useNotificationActions } from "@/store/useNotificationStore";
import { NOTIF_MSG, NOTIF_TYPE } from "./config/notifications";

export const usePlantDeathNotification = (userId: string) => {
	const { data } = usePlantStateQuery(userId);
	const { open } = useNotificationActions();

	useEffect(() => {
		if (!data) return;

		const deathCount = data.state.death_count;

		const key = `death_count_${userId}`;
		const stored = Number(localStorage.getItem(key) ?? "0");

		if (deathCount > stored) open(NOTIF_MSG.plant.dead, NOTIF_TYPE.alert);

		// Always sync local storage
		localStorage.setItem(key, String(deathCount));
	}, [data, userId, open]);
};
