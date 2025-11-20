import { addHabit, getHabits } from "@/features/habits/data/habits";
import type { Habit } from "@/types/habit.types";
import { create } from "zustand";

// STATE
interface HabitState {
	habits: Habit[];
	isFetching: boolean;
	error: string | null;
}

const useHabitsStore = create<HabitState>(() => ({
	habits: [],
	isFetching: false,
	error: null,
}));

// ACTIONS

export const getHabitsAction = async (userId: string) => {
	const set = useHabitsStore.setState;

	set({ isFetching: true, error: null });

	const { data, error } = await getHabits(userId);

	if (error) {
		set({ error: error.message, isFetching: false });
		return;
	}

	const sorted = (data ?? []).sort(
		(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
	);

	set({
		habits: sorted,
		isFetching: false,
	});
};

export const addHabitAction = async (userId: string, name: string, description: string) => {
	const set = useHabitsStore.setState;

	const tempId = Date.now().toString();

	const optimisticHabit: Habit = {
		id: tempId,
		name,
		user_id: userId,
		description,
		created_at: new Date().toISOString(),
		frequency_type: "daily",
		target_per_week: null,
		target_per_month: null,
	};

	// Optimistic update
	set((state) => ({
		habits: [...state.habits, optimisticHabit],
		error: null,
	}));

	const { data: saved, error } = await addHabit(name, userId, description);

	if (error) {
		set((state) => ({
			habits: state.habits.filter((h) => h.id !== tempId),
			error: error.message,
		}));
		return;
	}

	if (saved) {
		set((state) => ({
			habits: state.habits.map((h) => (h.id === tempId ? saved : h)),
		}));
	}
};

// SELECTOR HOOKS

export const useHabits = () => useHabitsStore((state) => state.habits);
export const useHabitsFetching = () => useHabitsStore((state) => state.isFetching);
export const useHabitsError = () => useHabitsStore((state) => state.error);

export const useHabitsActions = () => ({
	getHabits: getHabitsAction,
	addHabit: addHabitAction,
});
