import { useQuery } from "@tanstack/react-query";
import { getPlantState } from "@/features/plant/data/plant-state";
import { plantStateKey } from "@/lib/helpers/queryKeys";
import { getPlantStageFromGrowth } from "@/lib/plant-growth/getPlantStageFromGrowth";
import type { PlantEntry } from "@/types/plant.types";

export const usePlantStateQuery = (userId: string) =>
	useQuery<PlantEntry>({
		queryKey: [...plantStateKey(userId)],
		enabled: !!userId,

		queryFn: async () => {
			const { data, error } = await getPlantState(userId);

			if (error) throw new Error(error.message);

			if (!data) {
				return {
					state: {
						user_id: userId,
						growth_score: 0,
						death_count: 0,
						last_growth_date: null,
						last_submitted_health: 0,
						last_health_update_date: null,
						updated_at: null,
						created_at: null,
					},
					stage: 0,
					isInitialized: false,
				} satisfies PlantEntry;
			}

			return {
				state: data,
				stage: getPlantStageFromGrowth(data.growth_score),
				isInitialized: true,
			};
		},

		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
	});
