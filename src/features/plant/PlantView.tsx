import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import { useHabitsQuery } from "../habits/hooks/queries/useHabitsQuery";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { usePlantHealth } from "./hooks/usePlantHealth";
import PlantAnimation from "./components/PlantAnimation";
import PlantSvgAnimated from "./components/PlantSvgAnimated";
import { usePlantAnimActions, usePlantAnimEnabled } from "@/store/usePlantAnimationStore";
import { usePlantGrowth } from "./hooks/usePlantGrowth";

const PlantView = () => {
	const userId = useUserIdRequired();
	const { data: habits, isLoading, isError, error } = useHabitsQuery(userId);

	const plantHealth = usePlantHealth({ habits: habits ?? [] });
	const {
		stage,
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

	if (isLoading || isLoadingGrowth) return <LoadingSpinner />;
	if (isError || isErrorGrowth) return <div>Error: {error?.message || errorGrowth?.message}</div>;

	return (
		<div className="plant-view">
			<div className="plant-render-container">
				{hasSeenAnim && stage !== 0 ? (
					<PlantAnimation stage={stage} onComplete={handleLottieComplete} />
				) : (
					<PlantSvgAnimated stage={stage} />
				)}
			</div>

			<h1>Plant health: {plantHealth}</h1>
		</div>
	);
};

export default PlantView;
