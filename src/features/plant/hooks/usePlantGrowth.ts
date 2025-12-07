import { useMemo } from "react";
import { usePlantStateQuery } from "./queries/usePlantStateQuery";
import type { PlantStageOrZero } from "@/types/plant.types";

/**
 * Purely reads plant_state from backend.
 * No logic based on frontend plantHealth or habitCount.
 */
export const usePlantGrowth = (userId: string) => {
	const { data, isLoading, isError, error } = usePlantStateQuery(userId);

	const result: { stage: PlantStageOrZero; growthScore: number } = useMemo(() => {
		if (!data) {
			return {
				stage: 0,
				growthScore: 0,
			};
		}

		const { state, stage } = data;

		return {
			stage,
			growthScore: state.growth_score,
		};
	}, [data]);

	return {
		isLoading,
		isError,
		error,
		...result,
	};
};
