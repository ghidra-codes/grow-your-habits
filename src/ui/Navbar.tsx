import { useStatsModalStore } from "@/store/useStatsModalStore";
import { supabase } from "@/utils/supabase-client";
import { BiLogOut } from "react-icons/bi";
import { LuChartLine } from "react-icons/lu";
import { MdChecklist } from "react-icons/md";
import { PiPlant } from "react-icons/pi";

const Navbar = () => {
	const { open } = useStatsModalStore();

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error("Logout error:", error);
	};

	return (
		<nav className="vertical-navbar">
			<ul>
				<li>
					<a href="/">
						<PiPlant />
					</a>
				</li>
				<li>
					<a href="/habits">
						<MdChecklist />
					</a>
				</li>
				<li onClick={open}>
					<LuChartLine />
				</li>
				<li onClick={handleLogout}>
					<BiLogOut />
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
