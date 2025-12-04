import React, { useRef, useMemo } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useLottieSvgExtractor } from "@/features/plant/hooks/utils/useLottieSvgExtractor";

const FRAME_TO_EXTRACT = 2;
const EXTRACTION_ENABLED = true;

interface LottieExtractorProps {
	animationJson: object;
}

const LottieExtractorComponent: React.FC<LottieExtractorProps> = ({ animationJson }) => {
	const lottieApiRef = useRef<LottieRefCurrentProps | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const targetFrame = useMemo(() => FRAME_TO_EXTRACT, []);

	useLottieSvgExtractor(lottieApiRef, containerRef, targetFrame, animationJson, EXTRACTION_ENABLED);

	return (
		<div ref={containerRef} style={{ width: 200, height: 200 }}>
			<Lottie
				lottieRef={lottieApiRef}
				animationData={animationJson}
				loop={false}
				autoplay={!EXTRACTION_ENABLED}
			/>
		</div>
	);
};

export default LottieExtractorComponent;
