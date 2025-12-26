import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { hasAnyHabitLogs } from "@/lib/habits/hasAnyHabitLogs";
import { usePlantStateQuery } from "../queries/usePlantStateQuery";

/**
 * Determines whether the user has access to statistics and insights views.
 * Access is granted only once the plant state is initialized and at least
 * one habit has recorded activity.
 */
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
