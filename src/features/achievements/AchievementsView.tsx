import { useUserIdRequired } from "@/hooks/useUserIdRequired";
import { useAchievementContext } from "@/features/achievements/hooks/useAchievementContext";
import { useAchievements } from "@/features/achievements/hooks/useAchievements";
import LoadingSpinner from "@/ui/LoadingSpinner";

const AchievementsView = () => {
	const userId = useUserIdRequired();

	const context = useAchievementContext(userId);

	const { achievements, isLoading } = useAchievements(userId, context);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="achievements-view">
			<h2>Achievements</h2>

			<div className="achievements-list">
				{achievements.map((a) => (
					<div key={a.id} className={`achievement-card ${a.unlocked ? "unlocked" : "locked"}`}>
						<div className="achievement-header">
							<h3>{a.title}</h3>
							{a.unlocked && <span className="achievement-badge">Unlocked</span>}
						</div>

						<p className="achievement-description">{a.description}</p>

						{a.unlocked && a.unlockedAt && (
							<p className="achievement-date">
								Unlocked on {new Date(a.unlockedAt).toLocaleDateString()}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default AchievementsView;
