import { getMonthlyGrowthChange } from "@/features/plant/data/plant-state";
import { useQuery } from "@tanstack/react-query";

export const useMonthlyGrowthChange = (userId: string) => {
	return useQuery({
		queryKey: ["monthly-growth", userId],
		queryFn: () => getMonthlyGrowthChange(userId),
	});
};
