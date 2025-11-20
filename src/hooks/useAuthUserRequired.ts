import { useAuthLoading, useAuthUser } from "@/store/useAuthStore";
import type { User } from "@supabase/supabase-js";

export const useAuthUserRequired = (): User => {
	const user = useAuthUser();
	const loading = useAuthLoading();

	if (loading) throw new Error("Authentication state is not ready yet.");
	if (!user) throw new Error("No authenticated user available for this view.");

	return user;
};
