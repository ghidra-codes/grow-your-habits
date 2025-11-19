import { PiPlant } from "react-icons/pi";
import { MdChecklist } from "react-icons/md";
import { supabase } from "@/utils/supabase-client";
import { BiLogOut } from "react-icons/bi";

const Navbar = () => {
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
				<li onClick={handleLogout}>
					<BiLogOut />
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
