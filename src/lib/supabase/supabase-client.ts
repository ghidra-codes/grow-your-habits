import type { Database } from "@/types/supabase.types";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Supabase URL or Key is not defined in environment variables");
}

export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseKey);
