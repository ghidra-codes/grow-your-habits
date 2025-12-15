import { PLANT_SVGS } from "@/assets/lottie/svgs";
import type { PlantStageOrZero } from "@/types/plant.types";
import { blackoutSvg } from "../utils/blackoutSvg";

interface PlantSvgPreviewProps {
	stage: PlantStageOrZero;
}

const PlantSvgPreview = ({ stage }: PlantSvgPreviewProps) => {
	const nextStage = stage + 1;
	if (nextStage >= PLANT_SVGS.length) return null;

	const raw = PLANT_SVGS[nextStage];
	const blackedOut = blackoutSvg(raw);

	return (
		<div className="next-stage-preview-container">
			<span className="preview-eyebrow">Upcoming</span>
			<h3 className="preview-title">Next Growth Stage</h3>

			<div className="next-stage-preview-svg" dangerouslySetInnerHTML={{ __html: blackedOut }} />

			<p className="preview-hint">Keep your habits consistent to unlock</p>
		</div>
	);
};

export default PlantSvgPreview;
