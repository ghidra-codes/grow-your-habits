import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { hasAnyHabitLogs } from "@/lib/habits/hasAnyHabitLogs";
import { usePlantStateQuery } from "../queries/usePlantStateQuery";

export const useStatsAndInsightsAccess = () => {
	const userId = useUserIdRequired();

	const { data: plantData, isLoading: plantLoading } = usePlantStateQuery(userId);
	const { data: habits = [], isLoading: habitsLoading } = useHabitsQuery(userId);

	const isInitialized = plantData?.isInitialized ?? false;
	const hasHabitLogs = hasAnyHabitLogs(habits);

	return {
		hasAccess: isInitialized && hasHabitLogs,
		isLoading: plantLoading || habitsLoading,
	};
};
