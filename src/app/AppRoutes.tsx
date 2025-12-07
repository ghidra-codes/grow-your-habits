import { Routes, Route } from "react-router";
import Layout from "./Layout";
import PlantView from "@/features/plant/PlantView";
import HabitsView from "@/features/habits/HabitsView";
import LoginView from "@/features/auth/LoginView";
import RegisterView from "@/features/auth/RegisterView";
import AchievementsView from "@/features/achievements/AchievementsView";
import InsightsView from "@/features/insights/InsightsView";

const AppRoutes = () => {
	return (
		<Routes>
			{/* PUBLIC ROUTES (Login, Register) */}
			<Route path="/login" element={<LoginView />} />
			<Route path="/register" element={<RegisterView />} />

			{/* PROTECTED ROUTES */}
			<Route path="/" element={<Layout />}>
				<Route index element={<PlantView />} />
				<Route path="habits" element={<HabitsView />} />
				<Route path="achievements" element={<AchievementsView />} />
				<Route path="insights" element={<InsightsView />} />

				<Route path="*" element={<h2>404: Page Not Found</h2>} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
