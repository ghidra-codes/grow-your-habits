import { PLANT_SVGS } from "@/assets/lottie/svgs";
import type { PlantStageOrZero } from "@/types/plant.types";
import { useEffect, useMemo, useRef, useState } from "react";

interface PlantSvgAnimatedProps {
	stage: PlantStageOrZero;
	swayScale?: number;
	swayRotate?: number;
	swayDuration?: number;
	glowColor?: string;
}

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const PlantSvgAnimated = ({
	stage,
	swayScale = 1.02,
	swayRotate = 1.05,
	swayDuration = 3,
	glowColor = "rgba(127, 255, 196, 0.2)",
}: PlantSvgAnimatedProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);

	const svgRaw = useMemo(() => PLANT_SVGS[stage], [stage]);

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		el.style.setProperty("--sway-scale", String(swayScale));
		el.style.setProperty("--sway-rotate", `${swayRotate}deg`);
		el.style.setProperty("--sway-duration", `${swayDuration}s`);

		if (!ready) requestAnimationFrame(() => setReady(true));
	}, [svgRaw, swayScale, swayRotate, swayDuration, ready]);

	const style: CSSVars = {
		"--glow-color": glowColor,
	};

	return (
		<div className={`plant-glow-wrapper ${ready ? "visible" : ""}`} style={style}>
			<div
				ref={wrapperRef}
				className="plant-svg-wrapper"
				dangerouslySetInnerHTML={{ __html: svgRaw }}
			/>
		</div>
	);
};

export default PlantSvgAnimated;
