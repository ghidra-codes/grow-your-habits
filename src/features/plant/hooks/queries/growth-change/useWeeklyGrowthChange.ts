import { getWeeklyGrowthChange } from "@/features/plant/data/plant-state";
import { useQuery } from "@tanstack/react-query";

export const useWeeklyGrowthChange = (userId: string) => {
	return useQuery({
		queryKey: ["weekly-growth", userId],
		queryFn: () => getWeeklyGrowthChange(userId),
	});
};
