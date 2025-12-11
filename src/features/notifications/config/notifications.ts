// NOTIFICATION TYPES

export const NOTIF_TYPE = {
	success: "success",
	alert: "alert",
	info: "info",
} as const;

// NOTIFICATION MESSAGES

export const NOTIF_MSG = {
	plant: {
		critical: "Your plant health is critically low!",
		recovering: "Your plant is recovering!",
		thriving: "Your plant is thriving!",
		dead: "Your plant has died.",
	},

	streak: (streak: number, unit: string) => `Streak continues! You're on a ${streak}-${unit} streak`,

	achievements: (title: string) => `Achievement unlocked: ${title}!`,
} as const;

// LABELS FOR STREAK FREQUENCIES

export const STREAK_UNITS = {
	daily: "day",
	weekly: "week",
	monthly: "month",
} as const;

// STREAK THRESHOLDS

export const STREAK_THRESHOLDS = {
	daily: 4,
	weekly: 3,
	monthly: 2,
} as const;
