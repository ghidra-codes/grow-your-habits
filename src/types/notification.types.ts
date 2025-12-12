export type NotificationType = "success" | "alert";

export type NotificationCategory = "plant" | "streak" | "achievement";

export type Notification = {
	id: string;
	message: string;
	type: NotificationType;
	category: NotificationCategory;
};
