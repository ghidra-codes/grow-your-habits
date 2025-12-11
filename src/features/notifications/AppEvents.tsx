import { useAchievementNotifications } from "@/features/notifications/useAchievementNotifications";
import { usePlantHealthNotifications } from "./usePlantHealthNotifications";
import useStreakNotifications from "./useStreakNotifications";

const AppEvents = () => {
	useAchievementNotifications();
	usePlantHealthNotifications();
	useStreakNotifications();

	return null;
};

export default AppEvents;
