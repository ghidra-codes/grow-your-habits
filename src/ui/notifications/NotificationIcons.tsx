import type { NotificationCategory } from "@/types/notification.types";
import { FaLeaf, FaTrophy } from "react-icons/fa";
import { PiFireSimpleFill } from "react-icons/pi";

const NotificationIcon = ({ category }: { category: NotificationCategory }) => {
	switch (category) {
		case "plant":
			return <FaLeaf aria-hidden />;
		case "streak":
			return <PiFireSimpleFill aria-hidden />;
		case "achievement":
			return <FaTrophy aria-hidden />;
		default:
			return null;
	}
};

export default NotificationIcon;
