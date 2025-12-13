import type { NOTIF_MSG } from "@/features/notifications/config/notifications";

export type NotificationType = "success" | "alert";

export type NotificationCategory = "plant" | "streak" | "achievement";

export type Notification = {
	id: string;
	message: string;
	type: NotificationType;
	category: NotificationCategory;
};

export type StreakTier = keyof typeof NOTIF_MSG.streak;
