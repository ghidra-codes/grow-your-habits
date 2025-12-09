import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { getPointsToNextStage } from "@/lib/plant-growth/getPointsToNextStage";
import { usePlantAnimActions, usePlantAnimEnabled } from "@/store/usePlantAnimationStore";
import LoadingSpinner from "@/ui/LoadingSpinner";
import PlantAnimation from "./components/PlantAnimation";
import PlantSvgAnimated from "./components/PlantSvgAnimated";
import { GROWTH_STAGES } from "./config/growth-stage";
import { usePlantHealth } from "./hooks/derived/usePlantHealth";
import { usePlantStateQuery } from "./hooks/queries/usePlantStateQuery";
import { getHealthGlowColor } from "./utils/getHealthGlowColor";
import { getPlantColorProfile } from "./utils/getPlantColorProfile";
import FloatingParticles from "@/ui/FloatingParticles";

const PlantView = () => {
	const userId = useUserIdRequired();

	const { data, isLoading, isError, error } = usePlantStateQuery(userId);
	const plantHealth = usePlantHealth();

	const hasSeenAnim = usePlantAnimEnabled();
	const { disable } = usePlantAnimActions();

	const handleLottieComplete = () => disable();

	const pointsToNextStage = getPointsToNextStage(data?.state.growth_score ?? 0, data?.stage ?? 0);

	if (isLoading || !data) return <LoadingSpinner />;
	if (isError) return <div>Error: {error?.message}</div>;

	const { stage, state } = data;

	return (
		<div className="plant-view">
			<div className="plant-wrapper">
				<div className="plant-render-container">
					{hasSeenAnim && stage !== 0 ? (
						<PlantAnimation stage={stage} onComplete={handleLottieComplete} />
					) : (
						<PlantSvgAnimated
							stage={stage}
							glowColor={getHealthGlowColor(plantHealth)}
							profile={getPlantColorProfile(plantHealth)}
						/>
					)}

					<FloatingParticles />
				</div>

				<div className="plant-info">
					<div className="plant-growth-info">
						<div className="plant-growth-score">
							<span>GROWTH SCORE:</span> {state.growth_score}
						</div>
						<div className="points-to-next-stage">
							<span>POINTS TO NEXT:</span> {pointsToNextStage ?? "-"}
						</div>
					</div>

					<div className="plant-stage">
						<span>PLANT STAGE:</span> {GROWTH_STAGES[stage].name}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlantView;
