import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { NOTIF_MSG, NOTIF_TYPE } from "@/features/notifications/config/notifications";
import { useNotificationActions } from "@/store/useNotificationStore";
import { useMemo } from "react";
import { usePlantStateQuery } from "../queries/usePlantStateQuery";
import { useCalculatedPlantHealth } from "./useCalculatedPlantHealth";
import useSyncPlantHealth from "./useSyncPlantHealth";

export const usePlantHealth = () => {
	const userId = useUserIdRequired();

	const { data: plantState } = usePlantStateQuery(userId);
	const { data: habits = [] } = useHabitsQuery(userId);

	const calculated = useCalculatedPlantHealth(habits);
	const server = plantState?.state?.last_submitted_health ?? 0;

	// CHOOSE DISPLAYED HEALTH
	const displayHealth = useMemo(() => {
		// SHOW SERVER TRUTH IF DEAD
		if (server === 0) return 0;

		// AVOID FLASHING TO 0
		if (calculated === 0) return server;

		return calculated;
	}, [calculated, server]);

	// SYNC HEALTH TO SERVER
	const { push } = useNotificationActions();
	useSyncPlantHealth(userId, displayHealth, calculated, plantState?.isInitialized ?? false, () =>
		push(NOTIF_MSG.plant.dead, NOTIF_TYPE.alert, "plant")
	);

	return displayHealth;
};
