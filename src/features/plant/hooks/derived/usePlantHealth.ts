import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import useSyncPlantHealth from "@/features/plant/hooks/derived/useSyncPlantHealth";
import { useCalculatedPlantHealth } from "./useCalculatedPlantHealth";
import { usePlantStateQuery } from "../queries/usePlantStateQuery";

export const usePlantHealth = () => {
	const userId = useUserIdRequired();

	const { data: plantState } = usePlantStateQuery(userId);
	const { data: habits = [] } = useHabitsQuery(userId);

	const plantHealth = useCalculatedPlantHealth(habits);

	// Sync if initialized
	useSyncPlantHealth(userId, plantHealth, plantState?.isInitialized ?? false);

	return plantHealth;
};
