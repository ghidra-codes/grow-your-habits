import { endOfWeek, startOfWeek } from "date-fns";

export const getMonday = (date: Date) => startOfWeek(date, { weekStartsOn: 1 });

export const getSunday = (date: Date) => endOfWeek(date, { weekStartsOn: 1 });
