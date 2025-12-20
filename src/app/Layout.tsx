import AppEvents from "@/features/notifications/AppEvents";
import StatsModalView from "@/features/statistics/StatsModalView";
import { useAuthLoading, useAuthSession } from "@/store/useAuthStore";
import { useStatsModalActions, useStatsModalOpen } from "@/store/useStatsModalStore";
import { useVisualViewportHeight } from "@/ui/hooks/useVisualViewportHeight";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Modal from "@/ui/Modal";
import Navbar from "@/ui/Navbar";
import { TooltipProvider } from "@/ui/tooltip/TooltipContext";
import { Navigate, Outlet } from "react-router";

const Layout = () => {
	const session = useAuthSession();
	const loading = useAuthLoading();

	const isOpen = useStatsModalOpen();
	const { close } = useStatsModalActions();

	useVisualViewportHeight();

	if (loading) return <LoadingSpinner />;

	if (!session) return <Navigate to="/login" replace />;

	return (
		<div className="app-container">
			<TooltipProvider>
				<div className="nav-backdrop" />
				<Navbar />

				<AppEvents />

				<main>
					<div className="content-wrapper">
						<Outlet />
					</div>
				</main>

				<Modal
					isOpen={isOpen}
					handleClose={close}
					title="Statistics"
					description="Your habit performance data"
					containerClass="statistics-content-container"
				>
					<StatsModalView />
				</Modal>
			</TooltipProvider>
		</div>
	);
};

export default Layout;
