import { useMemo } from "react";
import Lottie from "lottie-react";
import { plantAnimations } from "@/assets/lottie";
import { getPlantStage } from "@/utils/plant-health/getPlantStage";

interface Props {
	health: number;
}

const PlantAnimation = ({ health }: Props) => {
	const stage = getPlantStage(health);
	const animationData = useMemo(() => plantAnimations[stage], [stage]);

	const key = `plant-stage-${4}`;

	return (
		<div className="plant-wrapper" style={{ width: 200, height: 200 }}>
			<Lottie
				animationData={animationData}
				loop={false}
				autoplay={true}
				key={key}
				style={{
					width: "100%",
					height: "100%",
				}}
			/>
		</div>
	);
};

export default PlantAnimation;
