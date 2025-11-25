// Helpers for stable useQuery keys

// HABITS
export const habitLogsKey = (userId: string, habitId: string) => ["habit_logs", userId, habitId];

export const habitsKey = (userId: string) => ["habits", userId];

export const habitScheduleKey = (habitId: string) => ["habit_schedule", habitId];
