import { addDays, startOfDay } from "date-fns";

export const getEarliestAllowedStart = (createdAt: Date, today: Date) =>
	createdAt > startOfDay(addDays(today, -365)) ? createdAt : startOfDay(addDays(today, -365));
