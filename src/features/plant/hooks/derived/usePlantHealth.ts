import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { NOTIF_MSG, NOTIF_TYPE } from "@/features/notifications/config/notifications";
import { hasAnyHabitLogs } from "@/lib/habits/hasAnyHabitLogs";
import { useNotificationActions } from "@/store/useNotificationStore";
import { useMemo } from "react";
import { BASELINE_HEALTH } from "../../config/health";
import { usePlantStateQuery } from "../queries/usePlantStateQuery";
import { useCalculatedPlantHealth } from "./useCalculatedPlantHealth";
import { useSyncPlantHealth } from "./useSyncPlantHealth";

export const usePlantHealth = () => {
	const userId = useUserIdRequired();

	const { data: plantState } = usePlantStateQuery(userId);
	const { data: habits = [] } = useHabitsQuery(userId);

	const hasHabitLogs = hasAnyHabitLogs(habits);

	const calculated = useCalculatedPlantHealth(habits, hasHabitLogs);
	const server = plantState?.state?.last_submitted_health ?? 0;

	// CHOOSE DISPLAYED HEALTH
	const displayHealth = useMemo(() => {
		// SERVER DEATH IS FINAL
		if (server === 0) return 0;

		// CRITICAL, TRUST SERVER
		if (server < 20) return server;

		// BASELINE
		if (!hasHabitLogs) return BASELINE_HEALTH;

		// NORMAL DERIVED MODE
		return calculated;
	}, [calculated, server, hasHabitLogs]);

	// SYNC HEALTH TO SERVER
	const { push } = useNotificationActions();
	useSyncPlantHealth(userId, displayHealth, calculated, plantState?.isInitialized ?? false, () =>
		push(NOTIF_MSG.plant.dead, NOTIF_TYPE.alert, "plant")
	);

	return displayHealth;
};
