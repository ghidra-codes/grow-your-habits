import { supabase } from "@/lib/supabase/supabase-client";
import type { Credentials } from "@/types/auth.types";

// LOGIN
export const login = async ({ email, password }: Credentials) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;

	return data;
};

// REGISTER
export const register = async ({ email, password }: Credentials) => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${window.location.origin}/confirm-email`,
		},
	});

	if (error) throw error;

	return data;
};

// LOGOUT
export const logout = async () => {
	const { error } = await supabase.auth.signOut();

	if (error) throw error;
};

// CHANGE EMAIL
export const changeEmail = async (email: string) => {
	const { error } = await supabase.auth.updateUser(
		{ email },
		{
			emailRedirectTo: window.location.origin,
		}
	);

	if (error) throw error;
};

// CHANGE PASSWORD
export const changePassword = async (password: string) => {
	const { error } = await supabase.auth.updateUser({
		password,
	});

	if (error) throw error;
};
