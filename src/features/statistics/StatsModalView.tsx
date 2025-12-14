import { useHabitsQuery } from "@/features/habits/hooks/queries/useHabitsQuery";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import LoadingSpinner from "@/ui/LoadingSpinner";
import HabitStatsCarousel from "./components/HabitStatsCarousel";
import HabitStatsCard from "./components/HabitStatsCard";
import type { EmblaCarouselType } from "embla-carousel";
import { useState } from "react";
import ErrorMessage from "@/ui/ErrorMessage";

const StatsModalView = () => {
	const userId = useUserIdRequired();
	const { data: habits = [], isLoading, isError, error } = useHabitsQuery(userId);

	const [timelineModes, setTimelineModes] = useState({});
	const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);

	if (isLoading) return <LoadingSpinner />;
	if (isError)
		return (
			<ErrorMessage
				title="Unable to load statistics"
				message="There was a problem loading your statistics. Please try again."
				errorMessage={error?.message}
			/>
		);

	return (
		<HabitStatsCarousel onApi={setEmblaApi}>
			{habits.map((habit) => {
				const frequency = habit.frequency_type;

				return (
					<HabitStatsCard
						key={habit.id}
						habit={habit}
						frequency={frequency}
						timelineModes={timelineModes}
						setTimelineModes={setTimelineModes}
						emblaApi={emblaApi}
					/>
				);
			})}
		</HabitStatsCarousel>
	);
};

export default StatsModalView;
