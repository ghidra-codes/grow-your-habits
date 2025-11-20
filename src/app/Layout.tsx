import { useAuthLoading, useAuthSession } from "@/store/useAuthStore";
import Navbar from "@/ui/Navbar";
import { Navigate, Outlet } from "react-router";

const Layout = () => {
	const session = useAuthSession();
	const loading = useAuthLoading();

	if (loading) return <div>Loading app...</div>;

	if (!session) return <Navigate to="/login" replace />;

	return (
		<div className="app-container">
			<Navbar />

			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
