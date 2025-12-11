import { AnimatePresence } from "motion/react";
import { useCurrentNotification, useNotificationActions } from "@/store/useNotificationStore";
import NotificationItem from "./NotificationItem";

const NotificationProvider = () => {
	const current = useCurrentNotification();
	const { close } = useNotificationActions();

	return (
		<div className="notification-stack">
			<AnimatePresence>
				{current && <NotificationItem key={current.id} n={current} close={close} />}
			</AnimatePresence>
		</div>
	);
};

export default NotificationProvider;
