import { supabase } from "@/lib/supabase/supabase-client";
import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
	session: Session | null;
	user: User | null;
	loading: boolean;
}

export const useAuthStore = create<AuthState>(() => ({
	session: null,
	user: null,
	loading: true,
}));

// ACTIONS

export const setSessionAction = (session: Session | null) => {
	useAuthStore.setState({
		session,
		user: session?.user ?? null,
		loading: false,
	});
};

export const resetAuthAction = () => {
	useAuthStore.setState({
		session: null,
		user: null,
		loading: false,
	});
};

// SELECTORS

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthSession = () => useAuthStore((state) => state.session);
export const useAuthLoading = () => useAuthStore((state) => state.loading);

export const useAuthActions = () => ({
	setSession: setSessionAction,
	resetAuth: resetAuthAction,
});

// INITIALIZE SUPABASE

supabase.auth.getSession().then(({ data }) => {
	setSessionAction(data.session);
});

supabase.auth.onAuthStateChange((_event, session) => {
	setSessionAction(session);
});
