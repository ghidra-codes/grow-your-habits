// Helpers for stable useQuery keys

// HABITS
export const habitsKey = (userId: string) => ["habits", userId] as const;

// PLANT STATE
export const plantStateKey = (userId: string) => ["plant_state", userId] as const;
