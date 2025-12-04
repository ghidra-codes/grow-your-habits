import { useMutation, useQueryClient } from "@tanstack/react-query";
import { incrementGrowthScore } from "@/features/plant/data/plant-state";
import { plantStateKey } from "@/utils/helpers/queryKeys";
import { getPlantStageFromGrowth } from "@/utils/plant-growth/getPlantStageFromGrowth";
import type { PlantEntry } from "@/types/plant.types";

export const useIncrementGrowth = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (amount: number) => {
			const { data, error } = await incrementGrowthScore(userId, amount);

			if (error) throw new Error(error.message);

			return data;
		},

		onSuccess: (updated) => {
			if (!updated) return;

			queryClient.setQueryData<PlantEntry>(plantStateKey(userId), (prev) => {
				if (!prev) return prev;

				return {
					state: updated,
					stage: getPlantStageFromGrowth(updated.growth_score),
				};
			});
		},
	});
};
