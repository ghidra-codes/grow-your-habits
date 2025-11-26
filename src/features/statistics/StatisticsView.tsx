import { useHabitsQuery } from "@/features/habits/hooks/useHabitsQuery";
import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import LoadingSpinner from "@/ui/LoadingSpinner";
import { useHabitAdherence } from "../habits/hooks/habit-adherence/useHabitAdherence";
import AdherenceCircle from "@/ui/AdherenceCircle";

const StatisticsView = () => {
	const userId = useUserIdRequired();

	const { data: habits = [], isLoading } = useHabitsQuery(userId);
	const { adherenceMap } = useHabitAdherence(habits);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="stats-list">
			{habits.map((habit) => {
				const adherence = adherenceMap[habit.id];

				return (
					<div key={habit.id} className="habit-stats-card">
						<h3>{habit.name}</h3>
						<AdherenceCircle
							percentage={adherence.percentage}
							className="habit-card-circle"
							textSize="28px"
						/>
						<p>Adherence: {adherence.percentage.toFixed(1)}%</p>
						<p>Completed: {adherence.logCount}</p>
						<p>Expected: {adherence.expected}</p>
						<p>Missed: {adherence.missed}</p>
						<p>{adherence.onTrack ? "On Track" : "Behind"}</p>
					</div>
				);
			})}
		</div>
	);
};

export default StatisticsView;
