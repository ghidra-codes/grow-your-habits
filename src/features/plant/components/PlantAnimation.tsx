import { useMemo, useCallback, useRef } from "react";
import Lottie from "lottie-react";
import type { PlantStage } from "@/types/plant.types";
import { PLANT_ANIMATIONS } from "@/assets/lottie";
import { recolorLottie } from "../utils/recolorLottie";

interface Props {
	onComplete: () => void;
	stage: PlantStage;
	profile: Record<string, string>;
}

/**
 * Renders a stage-specific Lottie animation for the plant.
 * Applies dynamic recoloring based on the active color profile and
 * guarantees the completion callback fires only once per animation.
 */
const PlantAnimation = ({ onComplete, stage, profile }: Props) => {
	const animData = useMemo(() => {
		const originalJson = PLANT_ANIMATIONS[stage];

		return recolorLottie(structuredClone(originalJson), profile);
	}, [stage, profile]);

	const completedRef = useRef(false);

	const handleComplete = useCallback(() => {
		if (completedRef.current) return;
		completedRef.current = true;
		onComplete();
	}, [onComplete]);

	const key = `plant-stage-${stage}`;

	return (
		<div className="plant-lottie-wrapper" aria-hidden="true">
			<Lottie
				key={key}
				animationData={animData}
				loop={false}
				autoplay={true}
				onComplete={handleComplete}
				rendererSettings={{ preserveAspectRatio: "none" }}
			/>
		</div>
	);
};

export default PlantAnimation;
