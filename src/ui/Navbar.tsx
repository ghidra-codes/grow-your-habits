import { supabase } from "@/lib/supabase-client";
import { useStatsModalActions } from "@/store/useStatsModalStore";
import { LuChartLine, LuLightbulb, LuLogOut, LuLeaf, LuListChecks, LuTrophy } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import PlantHealthBar from "./PlantHealthBar";
import { usePlantHealth } from "@/features/plant/hooks/derived/usePlantHealth";

const Navbar = () => {
	const plantHealth = usePlantHealth();

	const location = useLocation();
	const pathname = location.pathname;

	const { open } = useStatsModalActions();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error("Logout error:", error);
	};

	const isActive = (route: string) => pathname === route;

	return (
		<nav className="vertical-navbar">
			<ul>
				<li>
					<span className={`nav-label ${isActive("/") ? "active" : ""}`}>PLANT</span>
					<div className="nav-link-wrapper">
						<Link to="/">
							<LuLeaf />
						</Link>
					</div>
				</li>
				<li>
					<span className={`nav-label ${isActive("/habits") ? "active" : ""}`}>HABITS</span>
					<div className="nav-link-wrapper">
						<Link to="/habits">
							<LuListChecks />
						</Link>
					</div>
				</li>
				<li onClick={open}>
					<span className="nav-label">STATS</span>
					<div className="nav-link-wrapper">
						<LuChartLine />
					</div>
				</li>
				<li>
					<span className={`nav-label ${isActive("/insights") ? "active" : ""}`}>INSIGHT</span>
					<div className="nav-link-wrapper">
						<Link to="/insights">
							<LuLightbulb />
						</Link>
					</div>
				</li>
				<li>
					<span className={`nav-label ${isActive("/achievements") ? "active" : ""}`}>BADGES</span>
					<div className="nav-link-wrapper">
						<Link to="/achievements">
							<LuTrophy id="trophy-icon" />
						</Link>
					</div>
				</li>
				<li onClick={handleLogout}>
					<span className="nav-label">LOGOUT</span>
					<div className="nav-link-wrapper">
						<LuLogOut className="logout-icon" />
					</div>
				</li>
			</ul>

			<div className="plant-health-wrapper">
				<span className="nav-label">PLANT HEALTH</span>
				<PlantHealthBar health={plantHealth} />
			</div>
		</nav>
	);
};

export default Navbar;
