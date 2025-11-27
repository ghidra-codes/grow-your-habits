import { useAuthLoading, useAuthSession } from "@/store/useAuthStore";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Navbar from "@/ui/Navbar";
import { Navigate, Outlet } from "react-router";

const Layout = () => {
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
		</div>
	);
};

export default Layout;
