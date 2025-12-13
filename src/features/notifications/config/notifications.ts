// NOTIFICATION TYPES

export const NOTIF_TYPE = {
	success: "success",
	alert: "alert",
} as const;

// NOTIFICATION MESSAGES

export const NOTIF_MSG = {
	plant: {
		critical: "Your plant health is critically low!",
		thriving: "Your plant is thriving!",
		dead: "Your plant has died.",
	},

	streak: {
		4: (streak: number, unit: string) => `Streak continues! ${streak}-${unit} streak`,
		8: (streak: number, unit: string) => `Awesome! ${streak}-${unit} streak reached!`,
		12: (streak: number, unit: string) => `Incredible! ${streak}-${unit} fullstack streak!`,
	},
	achievements: (title: string) => `Badge unlocked: ${title}`,
} as const;

// STREAK TIERS

export const STREAK_TIERS = [4, 8, 12] as const;

// LABELS FOR STREAK FREQUENCIES

export const STREAK_UNITS = {
	daily: "day",
	weekly: "week",
	monthly: "month",
} as const;
