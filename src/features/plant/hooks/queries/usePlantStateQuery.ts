import { useQuery } from "@tanstack/react-query";
import { getPlantState, initPlantState } from "@/features/plant/data/plant-state";
import { plantStateKey } from "@/lib/helpers/queryKeys";
import { getPlantStageFromGrowth } from "@/lib/plant-growth/getPlantStageFromGrowth";
import type { PlantEntry } from "@/types/plant.types";

export const usePlantStateQuery = (userId: string) =>
	useQuery<PlantEntry>({
		queryKey: [...plantStateKey(userId)],
		enabled: !!userId,

		queryFn: async () => {
			const fetchState = async () => {
				const { data, error } = await getPlantState(userId);

				// IF NO PLANT STATE, INIT A NEW ONE
				if (error && error.code === "PGRST116") {
					const init = await initPlantState(userId);
					if (!init.data) throw new Error(init.error?.message ?? "Failed to init plant state");
					return init.data;
				}

				if (!data) throw new Error(error?.message ?? "Failed to fetch plant state");

				return data;
			};

			const state = await fetchState();

			return { state, stage: getPlantStageFromGrowth(state.growth_score) };
		},

		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
	});
