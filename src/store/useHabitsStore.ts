import { addHabit, getHabits } from "@/features/habits/data/habits";
import type { Habit } from "@/types/habit.types";
import { create } from "zustand";

interface HabitState {
	habits: Habit[];
	isFetching: boolean;
	error: string | null;

	fetchHabits: (userId: string) => Promise<void>;
	addHabit: (newHabitName: string, userId: string, description: string) => Promise<void>;
}

export const useHabitsStore = create<HabitState>((set) => ({
	habits: [],
	isFetching: false,
	error: null,

	fetchHabits: async (userId: string) => {
		set({ isFetching: true, error: null });

		const { data, error } = await getHabits(userId);

		if (error) {
			set({ error: error.message, isFetching: false });
		} else if (data) {
			const sortedData = data.sort(
				(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
			);

			set({ habits: sortedData, isFetching: false });
		} else {
			set({ habits: [], isFetching: false });
		}
	},

	addHabit: async (newHabitName: string, userId: string, description: string) => {
		const tempId = Date.now().toString();
		const newHabitOptimistic: Habit = {
			id: tempId,
			name: newHabitName,
			user_id: userId,
			created_at: new Date().toISOString(),
			description: description,
			is_active: true,
		};

		set((state) => ({
			habits: [...state.habits, newHabitOptimistic],
			error: null,
		}));

		const { data: finalHabit, error: dbError } = await addHabit(newHabitName, userId, description);

		if (dbError) {
			set((state) => ({
				habits: state.habits.filter((h) => h.id !== tempId),
				error: dbError.message,
			}));
		} else if (finalHabit) {
			set((state) => ({
				habits: state.habits.map((h) => (h.id === tempId ? finalHabit : h)),
			}));
		}
	},
}));
