import type { Database } from "./supabase.types";

export type FrequencyType = "daily" | "weekly" | "monthly" | "custom";

export type Habit = Omit<Database["public"]["Tables"]["habits"]["Row"], "frequency_type"> & {
	frequency_type: FrequencyType;
};

export type HabitInsert = Omit<Database["public"]["Tables"]["habits"]["Insert"], "frequency_type"> & {
	frequency_type: FrequencyType;
};

export type HabitWithLogs = Habit & {
	habit_logs: { id: string; log_date: string }[] | null;
};

export type HabitPayload = {
	name: string;
	description: string;
	frequency_type: FrequencyType;
	target_per_week: number | null;
	target_per_month: number | null;
};

export type UpdateHabitPayload = HabitPayload & { habitId: string };

// LOGS

export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];

export type HabitLogInsert = Database["public"]["Tables"]["habit_logs"]["Insert"];

export type HabitLogState = {
	hasLoggedToday: boolean;
	logDate?: string;
};

export type HabitAdherence = {
	habitId: string;
	expected: number;
	actual: number;
	period: "day" | "week" | "month";
	onTrack: boolean;
	percentage: number;
	missed: number;
};
