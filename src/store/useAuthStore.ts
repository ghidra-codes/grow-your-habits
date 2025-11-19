// src/stores/useAuthStore.ts (Conceptual Outline)
import { create } from "zustand";
import { type Session, type User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase-client";

interface AuthState {
	session: Session | null;
	user: User | null;
	loading: boolean;
	setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	session: null,
	user: null,
	loading: true,

	setSession: (session) => {
		set({ session, user: session?.user ?? null, loading: false });
	},
}));

supabase.auth.getSession().then(({ data }) => {
	useAuthStore.getState().setSession(data.session);
});

supabase.auth.onAuthStateChange((_event, session) => {
	useAuthStore.getState().setSession(session);
});
