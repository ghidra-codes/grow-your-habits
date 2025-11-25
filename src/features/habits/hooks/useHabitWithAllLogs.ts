import { useQuery } from "@tanstack/react-query";
import { getHabitWithAllLogs } from "../data/habits";

export const useHabitWithAllLogs = (habitId: string) =>
	useQuery({
		queryKey: ["habitWithAllLogs", habitId],
		queryFn: async () => {
			const { data, error } = await getHabitWithAllLogs(habitId);
			if (error) throw new Error(error.message);
			return data!;
		},
		enabled: !!habitId,
		staleTime: Infinity,
	});
