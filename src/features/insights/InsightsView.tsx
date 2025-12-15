import LoadingSpinner from "@/ui/LoadingSpinner";
import { useUserIdRequired } from "../auth/hooks/useUserIdRequired";
import { useHabitsQuery } from "../habits/hooks/queries/useHabitsQuery";
import { useMonthlyGrowthChange } from "../plant/hooks/queries/growth-change/useMonthlyGrowthChange";
import { useWeeklyGrowthChange } from "../plant/hooks/queries/growth-change/useWeeklyGrowthChange";
import { useInsights } from "./hooks/useInsights";
import InsightsList from "./components/InsightsList";
import ErrorMessage from "@/ui/ErrorMessage";
import InsightConfidenceBadge from "./components/InsightsBadge";
import { useInsightConfidence } from "./hooks/useInsightConfidence";

const InsightsView = () => {
	const userId = useUserIdRequired();

	const {
		data: habits = [],
		isLoading: habitsLoading,
		isError: habitsError,
		error: habitsErrorObj,
	} = useHabitsQuery(userId);
	const {
		data: weeklyGrowthChange = 0,
		isLoading: weeklyLoading,
		isError: weeklyError,
		error: weeklyErrorObj,
	} = useWeeklyGrowthChange(userId);
	const {
		data: monthlyGrowthChange = 0,
		isLoading: monthlyLoading,
		isError: monthlyError,
		error: monthlyErrorObj,
	} = useMonthlyGrowthChange(userId);

	const insights = useInsights({ habits, weeklyGrowthChange, monthlyGrowthChange });
	const confidence = useInsightConfidence(habits);

	const isLoading = habitsLoading || weeklyLoading || monthlyLoading;
	const isError = habitsError || weeklyError || monthlyError;

	if (isLoading) return <LoadingSpinner />;
	if (isError)
		return (
			<ErrorMessage
				title="Unable to load insights"
				message="There was a problem loading your insights. Please try again."
				errorMessage={habitsErrorObj?.message ?? weeklyErrorObj?.message ?? monthlyErrorObj?.message}
			/>
		);

	return (
		<div className="insights-container">
			<h2 className="view-heading">Insights</h2>

			<div className="insights-description">
				<p>Here are insights based on your habits and plant growth.</p>
				<p>Insights improve as you log more.</p>
			</div>

			<InsightConfidenceBadge {...confidence} />

			<div className="divider" />

			{insights.length === 0 && <div>No insights available.</div>}

			<div className="insights-list-wrapper">
				<p className="insights-list-info">Click the top card for more insights.</p>

				<ul className="insights-list">
					<InsightsList key={insights.map((i) => i.id).join("_")} rawInsights={insights} />
				</ul>
			</div>
		</div>
	);
};

export default InsightsView;
