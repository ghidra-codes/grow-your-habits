import { useMemo } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
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
		<div className="plant-wrapper" style={{ position: "relative", width: 200, height: 200 }}>
			{/* Static base (ground + plant) */}
			<Lottie
				animationData={animationData}
				loop={false}
				autoplay={true}
				key={key + "-static"}
				style={{
					width: "100%",
					height: "100%",
					position: "absolute",
					filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.5)) drop-shadow(0 0 18px rgba(74,222,128,0.35))",
					inset: 0,
				}}
			/>

			{/* Swaying plant only */}
			<motion.div
				className="plant-sway"
				style={{
					width: "100%",
					height: "100%",
					position: "absolute",
					inset: 0,
					overflow: "hidden",
					clipPath: "inset(0px 0px 45px 0px)",
					pointerEvents: "none",
				}}
				animate={{ rotate: [-1.25, 1.25, -1.25], scale: [1, 1.02, 1] }}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			>
				<Lottie
					animationData={animationData}
					loop={false}
					autoplay={true}
					key={key + "-animated"}
					style={{
						width: "100%",
						height: "100%",
					}}
				/>
			</motion.div>
		</div>
	);
};

export default PlantAnimation;
