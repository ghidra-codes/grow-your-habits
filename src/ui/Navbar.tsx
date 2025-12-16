import { usePlantHealth } from "@/features/plant/hooks/derived/usePlantHealth";
import { useStatsAndInsightsAccess } from "@/features/plant/hooks/derived/useStatsAndInsightsAccess";
import { supabase } from "@/lib/supabase/supabase-client";
import { useStatsModalActions } from "@/store/useStatsModalStore";
import { motion } from "motion/react";
import { FaLock } from "react-icons/fa";
import { LuChartLine, LuLeaf, LuLightbulb, LuListChecks, LuLogOut, LuTrophy } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import { tapSpring } from "./motion/motion-presets";
import PlantHealthBar from "./PlantHealthBar";
import Tooltip from "./tooltip/Tooltip";

const Navbar = () => {
	const plantHealth = usePlantHealth();

	const { open } = useStatsModalActions();
	const { hasAccess } = useStatsAndInsightsAccess();

	const { pathname } = useLocation();

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
				<li className="nav-list-item">
					<span className="nav-label">STATS</span>

					{hasAccess ? (
						<motion.button className="nav-link" {...tapSpring} onClick={() => open()}>
							<LuChartLine />
						</motion.button>
					) : (
						<Tooltip
							id="stats-locked"
							content={
								<div className="nav-tooltip-content">
									<FaLock size={22} />
									<span>Create and log a habit to unlock statistics</span>
								</div>
							}
							side="right"
						>
							<span className="nav-link disabled">
								<LuChartLine />
							</span>
						</Tooltip>
					)}
				</li>

				<li className={`nav-list-item ${isActive("/insights") ? "active" : ""}`}>
					<span className="nav-label">INSIGHT</span>

					{hasAccess ? (
						<motion.div className="link-wrapper" {...tapSpring}>
							<Link to="/insights" className="nav-link">
								<LuLightbulb />
							</Link>
						</motion.div>
					) : (
						<Tooltip
							id="insights-locked"
							content={
								<div className="nav-tooltip-content">
									<FaLock size={22} />
									<span>Create and log a habit to unlock insights</span>
								</div>
							}
							side="right"
						>
							<span className="nav-link disabled">
								<LuLightbulb />
							</span>
						</Tooltip>
					)}
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
