import { motion } from "motion/react";
import { useEffect } from "react";
import type { Notification } from "@/store/useNotificationStore";

type Props = {
	n: Notification;
	close: () => void;
};

const NotificationItem = ({ n, close }: Props) => {
	useEffect(() => {
		const timer = setTimeout(() => close(), 2500);
		return () => clearTimeout(timer);
	}, [n.id, close]);

	return (
		<motion.div
			className={`notification ${n.type}`}
			onClick={close}
			initial={{ opacity: 0, y: 15 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -15 }}
			transition={{ duration: 0.25 }}
		>
			{n.message}
		</motion.div>
	);
};

export default NotificationItem;
