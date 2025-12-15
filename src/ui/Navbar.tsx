import { usePlantHealth } from "@/features/plant/hooks/derived/usePlantHealth";
import { supabase } from "@/lib/supabase/supabase-client";
import { useStatsModalActions } from "@/store/useStatsModalStore";
import { motion } from "motion/react";
import { LuChartLine, LuLeaf, LuLightbulb, LuListChecks, LuLogOut, LuTrophy } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import { tapSpring } from "./motion/motion-presets";
import PlantHealthBar from "./PlantHealthBar";

const Navbar = () => {
	const plantHealth = usePlantHealth();

	const { pathname } = useLocation();

	const { open } = useStatsModalActions();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error("Logout error:", error);
	};

	const isActive = (route: string) => pathname === route;

	return (
		<nav className="vertical-navbar">
			<ul>
				<li className={`nav-list-item ${isActive("/") ? "active" : ""}`}>
					<span className="nav-label">PLANT</span>

					<motion.div className="link-wrapper" {...tapSpring}>
						<Link to="/" className="nav-link">
							<LuLeaf />
						</Link>
					</motion.div>
				</li>
				<li className={`nav-list-item ${isActive("/habits") ? "active" : ""}`}>
					<span className="nav-label">HABITS</span>

					<motion.div className="link-wrapper" {...tapSpring}>
						<Link to="/habits" className="nav-link">
							<LuListChecks />
						</Link>
					</motion.div>
				</li>
				<li className="nav-list-item" onClick={() => open()}>
					<span className="nav-label">STATS</span>
					<motion.button className="nav-link" {...tapSpring}>
						<LuChartLine />
					</motion.button>
				</li>
				<li className={`nav-list-item ${isActive("/insights") ? "active" : ""}`}>
					<span className="nav-label">INSIGHT</span>
					<motion.div className="link-wrapper" {...tapSpring}>
						<Link to="/insights" className="nav-link">
							<LuLightbulb />
						</Link>
					</motion.div>
				</li>
				<li className={`nav-list-item ${isActive("/achievements") ? "active" : ""}`}>
					<span className="nav-label">BADGES</span>
					<motion.div className="link-wrapper" {...tapSpring}>
						<Link to="/achievements" className="nav-link">
							<LuTrophy id="trophy-icon" />
						</Link>
					</motion.div>
				</li>
				<li className="nav-list-item" onClick={handleLogout}>
					<span className="nav-label">LOGOUT</span>
					<motion.button className="nav-link" {...tapSpring}>
						<LuLogOut className="logout-icon" />
					</motion.button>
				</li>
			</ul>

			<div className="plant-health-wrapper">
				<span className="nav-label">PLANT HEALTH - {plantHealth}%</span>
				<PlantHealthBar health={plantHealth} />
			</div>
		</nav>
	);
};

export default Navbar;
