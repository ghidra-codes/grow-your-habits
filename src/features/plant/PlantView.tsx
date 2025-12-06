import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import { useHabitsQuery } from "../habits/hooks/queries/useHabitsQuery";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { usePlantHealth } from "./hooks/usePlantHealth";
import PlantAnimation from "./components/PlantAnimation";
import PlantSvgAnimated from "./components/PlantSvgAnimated";
import { usePlantAnimActions, usePlantAnimEnabled } from "@/store/usePlantAnimationStore";
import { usePlantGrowth } from "./hooks/usePlantGrowth";
import { GROWTH_STAGES } from "./config/growthStageConfig";
import { getPointsToNextStage } from "@/lib/plant-growth/getPointsToNextStage";

const PlantView = () => {
	const userId = useUserIdRequired();
	const { data: habits, isLoading, isError, error } = useHabitsQuery(userId);

	const plantHealth = usePlantHealth(habits ?? []);
	const {
		stage,
		growthScore,
		isLoading: isLoadingGrowth,
		isError: isErrorGrowth,
		error: errorGrowth,
	} = usePlantGrowth({
		userId,
		plantHealth,
		habitCount: habits?.length ?? 0,
	});

	const hasSeenAnim = usePlantAnimEnabled();
	const { disable } = usePlantAnimActions();

	const handleLottieComplete = () => disable();
	const pointsToNextStage = getPointsToNextStage(growthScore, stage);

	if (isLoading || isLoadingGrowth) return <LoadingSpinner />;
	if (isError || isErrorGrowth) return <div>Error: {error?.message || errorGrowth?.message}</div>;

	return (
		<div className="plant-view">
			<div className="plant-wrapper">
				<div className="plant-render-container">
					{hasSeenAnim && stage !== 0 ? (
						<PlantAnimation stage={stage} onComplete={handleLottieComplete} />
					) : (
						<PlantSvgAnimated stage={stage} />
					)}
				</div>

				<div className="plant-info">
					<div className="plant-growth-info">
						<div className="plant-growth-score">
							<span>GROWTH SCORE:</span> {growthScore}
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
