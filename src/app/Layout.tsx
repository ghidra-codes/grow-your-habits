import StatsModalView from "@/features/statistics/StatsModalView";
import { useAuthLoading, useAuthSession } from "@/store/useAuthStore";
import { useStatsModalStore } from "@/store/useStatsModalStore";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Modal from "@/ui/Modal";
import Navbar from "@/ui/Navbar";
import { Navigate, Outlet } from "react-router";

const Layout = () => {
	const { isOpen, close } = useStatsModalStore();

	const session = useAuthSession();
	const loading = useAuthLoading();

	if (loading) return <LoadingSpinner />;

	if (!session) return <Navigate to="/login" replace />;

	return (
		<div className="app-container">
			<Navbar />

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
		</div>
	);
};

export default Layout;
