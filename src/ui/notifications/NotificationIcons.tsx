import type { NotificationCategory } from "@/types/notification.types";
import { FaLeaf, FaTrophy } from "react-icons/fa";
import { PiFireSimpleFill } from "react-icons/pi";

const NotificationIcon = ({ category }: { category: NotificationCategory }) => {
	switch (category) {
		case "plant":
			return <FaLeaf />;
		case "streak":
			return <PiFireSimpleFill />;
		case "achievement":
			return <FaTrophy />;
		default:
			return null;
	}
};

export default NotificationIcon;
