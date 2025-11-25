import { useQuery } from "@tanstack/react-query";
import { getAllHabitSchedules } from "../../data/habit-schedule";

export const useAllHabitSchedules = (userId: string) =>
	useQuery({
		queryKey: ["allHabitSchedules", userId],
		queryFn: async () => {
			const { data, error } = await getAllHabitSchedules(userId);
			if (error) throw new Error(error.message);
			return data ?? [];
		},
		staleTime: Infinity,
	});
