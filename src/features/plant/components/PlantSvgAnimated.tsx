import { PLANT_SVGS } from "@/assets/lottie/svgs";
import type { PlantStageOrZero } from "@/types/plant.types";
import { useEffect, useMemo, useRef, useState } from "react";
import { replacePlantColors } from "../utils/replacePlantColors";
import { SVG_ANIMATION_CONFIG } from "../config/svg_animation";

interface PlantSvgAnimatedProps {
	stage: PlantStageOrZero;
	glowColor: string;
	profile: Record<string, string> | null;
}

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const PlantSvgAnimated = ({ stage, glowColor, profile }: PlantSvgAnimatedProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);

	const { scale, rotate, duration } = SVG_ANIMATION_CONFIG[stage];

	const svgRaw = useMemo(() => {
		const raw = PLANT_SVGS[stage];
		if (!profile || stage === 0) return raw;

		return replacePlantColors(raw, profile);
	}, [stage, profile]);

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		el.style.setProperty("--sway-scale", String(scale));
		el.style.setProperty("--sway-rotate", `${rotate}deg`);
		el.style.setProperty("--sway-duration", `${duration}s`);

		if (!ready) requestAnimationFrame(() => setReady(true));
	}, [scale, rotate, duration, ready]);

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
