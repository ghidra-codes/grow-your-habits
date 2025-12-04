import { useMemo } from "react";
import { usePlantStateQuery } from "./queries/usePlantStateQuery";
import type { PlantStageOrZero } from "@/types/plant.types";

export const usePlantGrowth = ({
	userId,
	plantHealth,
	habitCount,
}: {
	userId: string;
	plantHealth: number;
	habitCount: number;
}) => {
	const { data, isLoading, isError, error } = usePlantStateQuery(userId, plantHealth);

	const result: { stage: PlantStageOrZero; growthScore: number } = useMemo(() => {
		if (!data) {
			return {
				stage: 0,
				growthScore: 0,
			};
		}

		const { state, stage } = data;

		const currentStage: PlantStageOrZero = plantHealth <= 0 || habitCount === 0 ? 0 : stage;

		return {
			stage: currentStage,
			growthScore: state.growth_score,
		};
	}, [data, plantHealth, habitCount]);

	return {
		isLoading,
		isError,
		error,
		...result,
	};
};
