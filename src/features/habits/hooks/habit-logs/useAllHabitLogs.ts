import { useQuery } from "@tanstack/react-query";
import { getAllHabitLogs } from "../../data/habit-logs";

export const useAllHabitLogs = (userId: string) =>
	useQuery({
		queryKey: ["allHabitLogs", userId],
		queryFn: async () => {
			const { data, error } = await getAllHabitLogs(userId);
			if (error) throw new Error(error.message);
			return data ?? [];
		},
		staleTime: Infinity,
	});
