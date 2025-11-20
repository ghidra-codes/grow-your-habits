import { useAuthUserRequired } from "./useAuthUserRequired";

export const useUserIdRequired = (): string => useAuthUserRequired().id;
