import type { Notification } from "@/types/notification.types";
import { motion } from "motion/react";
import { useEffect } from "react";
import NotificationIcon from "./NotificationIcons";
import { onActivate } from "@/lib/a11y/keyboard";

type Props = {
	n: Notification;
	close: () => void;
};

const NotificationItem = ({ n, close }: Props) => {
	useEffect(() => {
		const timer = setTimeout(() => close(), 5000);
		return () => clearTimeout(timer);
	}, [n.id, close]);

	return (
		<motion.div
			role={n.type === "alert" ? "alert" : "status"}
			className={`notification ${n.type}`}
			onClick={close}
			initial={{ opacity: 0.25, y: "calc(-100% - 1rem)" }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0.25, y: "calc(-100% - 1rem)" }}
			transition={{ duration: 0.25 }}
			onKeyDown={onActivate(close)}
		>
			<NotificationIcon category={n.category} />

			<p>{n.message}</p>
		</motion.div>
	);
};

export default NotificationItem;
