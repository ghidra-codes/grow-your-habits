import LoadingSpinner from "@/ui/LoadingSpinner";
import { useUserIdRequired } from "../auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "../habits/hooks/queries/useHabitsQuery";
import { useMonthlyGrowthChange } from "../plant/hooks/queries/growth-change/useMonthlyGrowthChange";
import { useWeeklyGrowthChange } from "../plant/hooks/queries/growth-change/useWeeklyGrowthChange";
import { useInsights } from "./hooks/useInsights";
import InsightsList from "./components/InsightsList";

const InsightsView = () => {
	const userId = useUserIdRequired();

	const { data: habits = [], isLoading } = useHabitsQuery(userId);
	const { data: weeklyGrowthChange = 0 } = useWeeklyGrowthChange(userId);
	const { data: monthlyGrowthChange = 0 } = useMonthlyGrowthChange(userId);

	const insights = useInsights({ habits, weeklyGrowthChange, monthlyGrowthChange });

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="insights-container">
			<h2>Insights</h2>

			{insights.length === 0 && <div>No insights available.</div>}

			<ul className="insights-list">
				<InsightsList key={insights.map((i) => i.id).join("_")} rawInsights={insights} />
			</ul>
		</div>
	);
};

export default InsightsView;
