import { useAchievementNotifications } from "@/features/notifications/useAchievementNotifications";
import { usePlantHealthNotifications } from "./usePlantHealthNotifications";
import { useStreakNotifications } from "./useStreakNotifications";

/**
 * Centralized side-effect runner for global application events.
 * Registers notification-related hooks for achievements, plant health,
 * and streak milestones without rendering UI.
 */
const AppEvents = () => {
	useAchievementNotifications();
	usePlantHealthNotifications();
	useStreakNotifications();

	return null;
};

export default AppEvents;
