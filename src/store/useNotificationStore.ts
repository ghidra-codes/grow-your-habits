import type { Notification, NotificationType } from "@/types/notification.types";
import { create } from "zustand";

interface NotificationStore {
	queue: Notification[]; // waiting notifications
	current: Notification | null; // currently visible notification
	processing: boolean; // is the system busy?
	push: (msg: string, type: NotificationType) => void;
	next: () => void; // show next notification
	removeCurrent: () => void; // remove active one
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
	queue: [],
	current: null,
	processing: false,

	push: (message, type = "info") => {
		const notification: Notification = {
			id: Math.random().toString(36),
			message,
			type,
		};

		// Push into queue
		set((state) => ({
			queue: [...state.queue, notification],
		}));

		// If nothing is showing, immediately start
		if (!get().processing) {
			get().next();
		}
	},

	next: () => {
		const { queue } = get();

		// Nothing left? stop
		if (queue.length === 0) {
			set({ current: null, processing: false });
			return;
		}

		// Take first item in queue
		const [nextNotification, ...rest] = queue;

		set({
			current: nextNotification,
			queue: rest,
			processing: true,
		});
	},

	removeCurrent: () => {
		set({ current: null });

		// Immediately continue to next queued notification
		get().next();
	},
}));

// ACTIONS

export const useNotificationActions = () => {
	const push = useNotificationStore.getState().push;
	const removeCurrent = useNotificationStore.getState().removeCurrent;

	return {
		open: (msg: string, type: NotificationType) => push(msg, type),
		close: () => removeCurrent(),
	};
};

// SELECTORS

export const useCurrentNotification = () => useNotificationStore((state) => state.current);
