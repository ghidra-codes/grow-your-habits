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
import { Link } from "react-router";

const PlantView = () => {
	const userId = useUserIdRequired();

	const { data, isLoading, isError, error } = usePlantStateQuery(userId);
	const plantHealth = usePlantHealth();

	const isInitialized = data?.isInitialized ?? false;

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

			<div className="plant-view-content">
				<div className="plant-wrapper">
					<div className="plant-render-container">
						{!isInitialized && (
							<div className="plant-uninitialized-overlay" role="status" aria-live="polite">
								<p>This soil is ready for something to grow.</p>
								<p>Create your first habit to plant the seed.</p>

								<Link to="/habits" className="add-habit-btn">
									Add a habit
								</Link>
							</div>
						)}
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

						{stage !== 0 && <FloatingParticles />}
					</div>

					<div className="plant-info">
						<div className="plant-stat">
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

						<div className="plant-stat">
							<span className="label">Plant Health</span>
							<span className="divider" />
							<span
								className="value"
								style={{
									color: isInitialized ? getHealthColor(plantHealth) : undefined,
								}}
							>
								{isInitialized ? `${plantHealth}%` : "—"}
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
