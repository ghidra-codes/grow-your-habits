import { supabase } from "@/lib/supabase-client";
const userId = "e1d24262-545a-4fd1-92cf-c1b205bc762f";

export const DevSimButtons = () => (
	<button
		onClick={async () => {
			await supabase.from("plant_state").update({ last_submitted_health: 0 }).eq("user_id", userId);
		}}
	>
		Simulate Health → 0
	</button>
);
