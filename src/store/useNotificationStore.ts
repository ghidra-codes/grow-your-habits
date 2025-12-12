import type { Notification, NotificationCategory, NotificationType } from "@/types/notification.types";
import { create } from "zustand";

interface NotificationStore {
	queue: Notification[];
	current: Notification | null;
	processing: boolean;
	push: (msg: string, type: NotificationType, category: NotificationCategory) => void;
	next: () => void;
	removeCurrent: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
	queue: [],
	current: null,
	processing: false,

	push: (message, type, category) => {
		const notification: Notification = {
			id: Math.random().toString(36),
			message,
			type,
			category,
		};

		set((state) => ({
			queue: [...state.queue, notification],
		}));

		if (!get().processing) {
			get().next();
		}
	},

	next: () => {
		const { queue } = get();

		if (queue.length === 0) {
			set({ current: null, processing: false });
			return;
		}

		const [nextNotification, ...rest] = queue;

		set({
			current: nextNotification,
			queue: rest,
			processing: true,
		});
	},

	removeCurrent: () => {
		set({ current: null });
	},
}));

// ACTIONS

export const useNotificationActions = () => {
	const push = useNotificationStore((state) => state.push);
	const next = useNotificationStore((state) => state.next);
	const close = useNotificationStore((state) => state.removeCurrent);

	return {
		push,
		next,
		close,
	};
};

// SELECTORS

export const useCurrentNotification = () => useNotificationStore((state) => state.current);
