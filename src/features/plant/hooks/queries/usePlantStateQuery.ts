import { useQuery } from "@tanstack/react-query";
import { getPlantState, initPlantState, updatePlantState } from "@/features/plant/data/plant-state";
import { plantStateKey } from "@/lib/helpers/queryKeys";
import { getDailyGrowthAmount } from "@/lib/plant-growth/getDailyGrowthAmount";
import { getPlantStageFromGrowth } from "@/lib/plant-growth/getPlantStageFromGrowth";
import type { PlantEntry } from "@/types/plant.types";

export const usePlantStateQuery = (userId: string, plantHealth: number, habitCount: number) =>
	useQuery<PlantEntry>({
		queryKey: [...plantStateKey(userId), plantHealth, habitCount],
		enabled: habitCount > 0 && plantHealth > 0,

		queryFn: async () => {
			// Fetch or init
			const fetchState = async () => {
				const { data, error } = await getPlantState(userId);

				if (error && error.code === "PGRST116") {
					const init = await initPlantState(userId);
					if (init.error || !init.data)
						throw new Error(init.error?.message ?? "Failed to init plant state");
					return init.data;
				}

				if (!data) throw new Error(error?.message ?? "Missing plant state");
				return data;
			};

			let state = await fetchState();

			// Daily growth check
			const today = new Date().toISOString().slice(0, 10);

			if (state.last_growth_date !== today) {
				const updated = await updatePlantState(userId, {
					growth_score: state.growth_score + getDailyGrowthAmount(plantHealth),
					last_growth_date: today,
				});

				if (!updated.data) throw new Error(updated.error?.message ?? "Failed to update plant growth");

				state = updated.data;
			}

			const stage = getPlantStageFromGrowth(state.growth_score);

			return { state, stage };
		},

		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
	});
