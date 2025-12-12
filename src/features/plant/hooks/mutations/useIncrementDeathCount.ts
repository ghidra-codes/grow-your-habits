import { incrementDeathCount } from "@/features/plant/data/plant-state";
import { plantStateKey } from "@/lib/helpers/queryKeys";
import { getPlantStageFromGrowth } from "@/lib/plant-growth/getPlantStageFromGrowth";
import type { PlantEntry } from "@/types/plant.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useIncrementDeathCount = (userId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { data, error } = await incrementDeathCount(userId);

			if (error) throw new Error(error.message);

			return data;
		},

		onSuccess: (updated) => {
			if (!updated) return;

			queryClient.setQueryData<PlantEntry>(plantStateKey(userId), (prev) => {
				if (!prev) return prev;

				return {
					...prev,
					state: updated,
					stage: getPlantStageFromGrowth(updated.growth_score),
				};
			});
		},
	});
};
