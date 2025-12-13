import { format } from "date-fns";

export const getTodayDate = () => format(new Date(), "yyyy-MM-dd");
