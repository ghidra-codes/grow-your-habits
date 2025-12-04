import { useMemo, useCallback, useRef } from "react";
import Lottie from "lottie-react";
import { plantAnimations } from "@/assets/lottie";
import type { PlantStage } from "@/types/plant.types";

interface Props {
	onComplete: () => void;
	stage: PlantStage;
}

const PlantAnimation = ({ onComplete, stage }: Props) => {
	const animationData = useMemo(() => plantAnimations[stage], [stage]);

	const completedRef = useRef(false);

	const handleComplete = useCallback(() => {
		if (completedRef.current) return;
		completedRef.current = true;
		onComplete();
	}, [onComplete]);

	const key = `plant-stage-${stage}`;

	return (
		<div className="plant-lottie-wrapper">
			<Lottie
				key={key}
				animationData={animationData}
				loop={false}
				autoplay={true}
				onComplete={handleComplete}
				rendererSettings={{ preserveAspectRatio: "none" }}
			/>
		</div>
	);
};

export default PlantAnimation;
