export type NotificationType = "success" | "alert" | "info";

export type Notification = {
	id: string;
	message: string;
	type: NotificationType;
};
