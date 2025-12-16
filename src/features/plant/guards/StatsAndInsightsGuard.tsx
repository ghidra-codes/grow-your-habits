import LoadingSpinner from "@/ui/LoadingSpinner";
import { Navigate, Outlet } from "react-router";
import { useStatsAndInsightsAccess } from "../hooks/derived/useStatsAndInsightsAccess";

const StatsAndInsightsGuard = () => {
	const { hasAccess, isLoading } = useStatsAndInsightsAccess();

	if (isLoading) return <LoadingSpinner />;

	if (!hasAccess) return <Navigate to="/habits" replace />;

	return <Outlet />;
};

export default StatsAndInsightsGuard;
