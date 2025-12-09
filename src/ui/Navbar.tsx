import { supabase } from "@/lib/supabase-client";
import { useStatsModalActions } from "@/store/useStatsModalStore";
import { BiLogOut } from "react-icons/bi";
import { GoTrophy } from "react-icons/go";
import { LuChartLine, LuLightbulb } from "react-icons/lu";
import { MdChecklist } from "react-icons/md";
import { PiPlant } from "react-icons/pi";
import { Link } from "react-router";
import PlantHealthBar from "./PlantHealthBar";
import { usePlantHealth } from "@/features/plant/hooks/derived/usePlantHealth";

const Navbar = () => {
	const plantHealth = usePlantHealth();

	const { open } = useStatsModalActions();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error("Logout error:", error);
	};

	return (
		<nav className="vertical-navbar">
			<ul>
				<li>
					<Link to="/">
						<PiPlant />
					</Link>
				</li>
				<li>
					<Link to="/habits">
						<MdChecklist />
					</Link>
				</li>
				<li onClick={open}>
					<LuChartLine />
				</li>
				<li>
					<Link to="/achievements">
						<GoTrophy />
					</Link>
				</li>
				<li>
					<Link to="/insights">
						<LuLightbulb />
					</Link>
				</li>
				<li onClick={handleLogout}>
					<BiLogOut />
				</li>
			</ul>

			<PlantHealthBar health={plantHealth} />
		</nav>
	);
};

export default Navbar;
