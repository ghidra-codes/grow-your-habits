import { AnimatePresence } from "motion/react";
import { useCurrentNotification, useNotificationActions } from "@/store/useNotificationStore";
import NotificationItem from "./NotificationItem";

const NotificationProvider = () => {
	const current = useCurrentNotification();
	const { next, close } = useNotificationActions();

	return (
		<div className="notification-stack">
			<AnimatePresence mode="wait" onExitComplete={next}>
				{current && <NotificationItem key={current.id} n={current} close={close} />}
			</AnimatePresence>
		</div>
	);
};

export default NotificationProvider;
