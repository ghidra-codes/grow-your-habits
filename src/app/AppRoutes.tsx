import AchievementsView from "@/features/achievements/AchievementsView";
import ConfirmEmailView from "@/features/auth/ConfirmEmailView";
import LoginView from "@/features/auth/LoginView";
import RegisterView from "@/features/auth/RegisterView";
import HabitsView from "@/features/habits/HabitsView";
import InsightsView from "@/features/insights/InsightsView";
import StatsAndInsightsGuard from "@/features/plant/guards/StatsAndInsightsGuard";
import PlantView from "@/features/plant/PlantView";
import { Route, Routes } from "react-router";
import Layout from "./Layout";

const AppRoutes = () => {
	return (
		<Routes>
			{/* PUBLIC ROUTES (Login, Register) */}
			<Route path="/login" element={<LoginView />} />
			<Route path="/register" element={<RegisterView />} />
			<Route path="/confirm-email" element={<ConfirmEmailView />} />

			{/* PROTECTED ROUTES */}
			<Route path="/" element={<Layout />}>
				<Route index element={<PlantView />} />
				<Route path="habits" element={<HabitsView />} />
				<Route path="achievements" element={<AchievementsView />} />

				<Route element={<StatsAndInsightsGuard />}>
					<Route path="insights" element={<InsightsView />} />
				</Route>

				<Route path="*" element={<h2>404: Page Not Found</h2>} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
