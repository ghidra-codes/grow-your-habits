import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import { useHabitsQuery } from "../habits/hooks/queries/useHabitsQuery";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { usePlantHealth } from "./hooks/usePlantHealth";
import PlantAnimation from "./components/PlantAnimation";
import AnimatedPlantSvg from "./components/AnimatedPlantSvg";
import testSvgRaw from "@/assets/lottie/svgs/test.svg?raw";

const PlantView = () => {
	const userId = useUserIdRequired();
	const { data: habits, isLoading, isError, error } = useHabitsQuery(userId);

	const plantHealth = usePlantHealth({
		habits: habits ?? [],
	});

	if (isLoading) return <LoadingSpinner />;
	if (isError) return <div>Error: {error?.message}</div>;

	return (
		<div className="plant-view">
			<AnimatedPlantSvg svgRaw={testSvgRaw} width={300} height={300} />
			<h1>Plant health: {plantHealth}</h1>
		</div>
	);
};

export default PlantView;
