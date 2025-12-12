import { useAchievementContext } from "@/features/achievements/hooks/useAchievementContext";
import { useAchievements } from "@/features/achievements/hooks/useAchievements";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import type { AchievementFilters } from "@/types/achievement.types";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Select from "@/ui/Select";
import { useState } from "react";
import { FaCheckCircle, FaLock, FaRegCheckCircle, FaUnlock } from "react-icons/fa";
import { FILTER_OPTIONS } from "./config/achievements-filter";

const AchievementsView = () => {
	const userId = useUserIdRequired();

	const [filter, setFilter] = useState<AchievementFilters>("all");

	const context = useAchievementContext(userId);

	const { achievements, isLoading } = useAchievements(userId, context, filter);

	if (isLoading) return <LoadingSpinner />;

	return (
		<div className="achievements-view">
			<h2>Achievement badges</h2>

			<div className="achievements-content">
				<div className="achievements-filter">
					<p>Filter:</p>

					<Select<AchievementFilters>
						options={FILTER_OPTIONS}
						value={filter}
						onChange={setFilter}
					/>
				</div>

				<div className="achievements-list">
					{achievements.map((achievement) => (
						<div
							key={achievement.id}
							className={`achievement-card ${achievement.unlocked ? "unlocked" : "locked"}`}
						>
							<div className="achievement-badge">
								<img src={achievement.badge} alt={achievement.title} />
							</div>

							<div className="achievement-info">
								<div className="achievement-header">
									<h3>{achievement.title}</h3>

									<div className="achievement-checkmark">
										{achievement.unlocked ? (
											<FaCheckCircle className="checkmark__unlocked" size={24} />
										) : (
											<FaRegCheckCircle className="checkmark__locked" size={24} />
										)}
									</div>
								</div>

								<p className="achievement-description">{achievement.description}</p>

								<p className="achievement-date">
									{achievement.unlocked && achievement.unlockedAt ? (
										<>
											<FaUnlock size={14} />{" "}
											{new Date(achievement.unlockedAt).toLocaleDateString()}
										</>
									) : (
										<FaLock size={14} />
									)}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AchievementsView;
