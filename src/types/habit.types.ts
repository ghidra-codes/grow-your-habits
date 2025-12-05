import type { Database, Tables } from "./supabase.types";

// HABIT

export type FrequencyType = "daily" | "weekly" | "monthly";

export type Habit = Omit<Database["public"]["Tables"]["habits"]["Row"], "frequency_type"> & {
	frequency_type: FrequencyType;
};

export type HabitLogs = {
	logs: Pick<Tables<"habit_logs">, "id" | "log_date">[];
};

export type HabitWithLogs = Habit & HabitLogs;

export type HabitPayload = {
	name: string;
	description: string;
	frequency_type: FrequencyType;
	target_per_week: number | null;
	target_per_month: number | null;
};

export type UpdateHabitPayload = HabitPayload & { habitId: string };

// LOG

export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];

export type HabitLogInsert = Database["public"]["Tables"]["habit_logs"]["Insert"];

// ADHERENCE

export type HabitAdherence = {
	habitId: string;
	expected: number;
	logCount: number;
	period: "day" | "week" | "month";
	onTrack: boolean;
	percentage: number;
	missed: number;
};

export type AdherenceMap = Record<string, HabitAdherence>;

export type ShortTermAdherence = {
	last7: number;
	last30: number;
};

export type ShortTermAdherenceMap = Record<string, ShortTermAdherence>;
