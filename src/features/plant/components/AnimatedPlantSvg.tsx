// src/components/AnimatedPlantSvg.tsx
import { useEffect, useRef } from "react";
import { animate } from "motion/react";

interface AnimatedPlantSvgProps {
	svgRaw: string;
	width?: number;
	height?: number;
	glowColor?: string;
}

const AnimatedPlantSvg = ({
	svgRaw,
	width = 200,
	height = 200,
	glowColor = "rgba(127, 255, 196, 0.2)",
}: AnimatedPlantSvgProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;

		const plant = wrapper.querySelector("#plant") as SVGGElement | null;
		if (!plant) return;

		plant.style.transformOrigin = "50% 50%";

		const animation = animate(
			plant as Element,
			{
				transform: ["scale(1) rotate(0deg)", "scale(1.025) rotate(2deg)", "scale(1) rotate(0deg)"],
			},
			{
				duration: 3,
				repeat: Infinity,
				ease: "easeInOut",
			}
		);

		return () => animation.cancel();
	}, [svgRaw]);

	return (
		<div
			style={{
				width,
				height,
				filter: `drop-shadow(0px -50px 30px ${glowColor})`,
			}}
		>
			<div
				ref={wrapperRef}
				dangerouslySetInnerHTML={{ __html: svgRaw }}
				style={{
					width: "100%",
					height: "100%",
				}}
			/>
		</div>
	);
};

export default AnimatedPlantSvg;
