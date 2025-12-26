import { useAuthLoading, useAuthUser } from "@/store/useAuthStore";
import type { User } from "@supabase/supabase-js";

/**
 * Returns the authenticated user or throws if unavailable.
 * Ensures authentication state is fully resolved before allowing access.
 */
export const useAuthUserRequired = (): User => {
	const user = useAuthUser();
	const loading = useAuthLoading();

	if (loading) throw new Error("Authentication state is not ready yet.");
	if (!user) throw new Error("No authenticated user available for this view.");

	return user;
};
