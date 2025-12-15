import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import { getPointsToNextStage } from "@/lib/plant";
import { usePlantAnimActions, usePlantAnimEnabled } from "@/store/usePlantAnimationStore";
import FloatingParticles from "@/ui/FloatingParticles";
import LoadingSpinner from "@/ui/LoadingSpinner";
import PlantAnimation from "./components/PlantAnimation";
import PlantSvgAnimated from "./components/PlantSvgAnimated";
import { GROWTH_STAGES } from "./config/growth-stage";
import { usePlantHealth } from "./hooks/derived/usePlantHealth";
import { usePlantStateQuery } from "./hooks/queries/usePlantStateQuery";
import { getHealthGlowColor } from "./utils/getHealthGlowColor";
import { getPlantColorProfile } from "./utils/getPlantColorProfile";
import ErrorMessage from "@/ui/ErrorMessage";
import PlantSvgPreview from "./components/PlantSvgPreview";
import { getHealthColor } from "./utils/getHealthColor";

const PlantView = () => {
	const userId = useUserIdRequired();

	const { data, isLoading, isError, error } = usePlantStateQuery(userId);
	const plantHealth = usePlantHealth();

	const hasSeenAnim = usePlantAnimEnabled();
	const { disable } = usePlantAnimActions();

	const handleLottieComplete = () => disable();

	const pointsToNextStage = getPointsToNextStage(data?.state.growth_score ?? 0, data?.stage ?? 0);

	if (isLoading || !data) return <LoadingSpinner />;
	if (isError)
		return (
			<ErrorMessage
				title="Unable to load your plant"
				message="There was a problem loading your plant state. Please try again."
				errorMessage={error?.message}
			/>
		);

	const { stage, state } = data;

	const profile = getPlantColorProfile(80);

	return (
		<div className="plant-view">
			<h2 className="view-heading">Your Plant</h2>

			<div className="plant-growth-path">
				<span className="path-dot active" />
				<span className="path-line" />
				<span className="path-dot upcoming" />
			</div>

			<div className="plant-view-content">
				<div className="plant-wrapper">
					<div className="plant-render-container">
						{hasSeenAnim && stage !== 0 && profile ? (
							<PlantAnimation
								stage={stage}
								onComplete={handleLottieComplete}
								profile={profile}
							/>
						) : (
							<PlantSvgAnimated
								stage={stage}
								glowColor={getHealthGlowColor(plantHealth)}
								profile={profile}
							/>
						)}

						<FloatingParticles />
					</div>

					<div className="plant-info">
						<div className="plant-stat primary">
							<span className="label">Stage</span>
							<span className="divider" />
							<span className="value">{GROWTH_STAGES[stage].name}</span>
						</div>

						<div className="plant-stat">
							<span className="label">Growth Score</span>
							<span className="divider" />
							<span className="value">{state.growth_score}</span>
						</div>

						<div className="plant-stat">
							<span className="label">Points to Next</span>
							<span className="divider" />
							<span className="value">{pointsToNextStage ?? "—"}</span>
						</div>

						<div className="plant-stat health">
							<span className="label">Plant Health</span>
							<span className="divider" />
							<span className="value" style={{ color: getHealthColor(plantHealth) }}>
								{plantHealth}%
							</span>
						</div>
					</div>
				</div>

				<PlantSvgPreview stage={stage} />
			</div>
		</div>
	);
};

export default PlantView;
