import { useAchievementContext } from "@/features/achievements/hooks/useAchievementContext";
import { useAchievements } from "@/features/achievements/hooks/useAchievements";
import { useUserIdRequired } from "@/features/auth/hooks/useUserIdRequired";
import type { AchievementFilters } from "@/types/achievement.types";
import LoadingSpinner from "@/ui/LoadingSpinner";
import Select from "@/ui/Select";
import { useState } from "react";
import { FaCheckCircle, FaLock, FaRegCheckCircle, FaUnlock } from "react-icons/fa";
import { FILTER_OPTIONS } from "./config/achievements-filter";
import ErrorMessage from "@/ui/ErrorMessage";

const AchievementsView = () => {
	const userId = useUserIdRequired();

	const [filter, setFilter] = useState<AchievementFilters>("all");

	const context = useAchievementContext(userId);

	const { achievements, isLoading, isError, error } = useAchievements(userId, context, filter);

	if (isLoading) return <LoadingSpinner />;
	if (isError)
		return (
			<ErrorMessage
				title="Unable to load achievements"
				message="There was a problem loading your achievements. Please try again."
				errorMessage={error?.message}
			/>
		);

	return (
		<div className="achievements-view">
			<h2 className="view-heading">Achievement badges</h2>

			<div className="achievements-content">
				<div className="achievements-filter">
					<p id="achievement-filter-label">Filter:</p>

					<Select<AchievementFilters>
						aria-labelledby="achievement-filter-label"
						options={FILTER_OPTIONS}
						value={filter}
						onChange={setFilter}
					/>
				</div>

				<ul className="achievements-list" aria-label="Achievement badges">
					{achievements.map((achievement) => (
						<li
							key={achievement.id}
							className={`achievement-card ${achievement.unlocked ? "unlocked" : "locked"}`}
							aria-disabled={!achievement.unlocked}
						>
							<div className="achievement-badge">
								<img src={achievement.badge} alt={`${achievement.title} badge`} />
							</div>

							<div className="achievement-info">
								<div className="achievement-header">
									<h3>{achievement.title}</h3>

									<div className="achievement-checkmark">
										{achievement.unlocked ? (
											<FaCheckCircle
												className="checkmark__unlocked"
												size={24}
												aria-hidden
											/>
										) : (
											<FaRegCheckCircle
												className="checkmark__locked"
												size={24}
												aria-hidden
											/>
										)}
									</div>
								</div>

								<p className="achievement-description">{achievement.description}</p>

								<p className="achievement-date">
									{achievement.unlocked && achievement.unlockedAt ? (
										<>
											<FaUnlock size={14} aria-hidden />{" "}
											<time dateTime={achievement.unlockedAt}>
												{new Date(achievement.unlockedAt).toLocaleDateString()}
											</time>
										</>
									) : (
										<>
											<FaLock size={14} aria-hidden />
											<span className="sr-only">Locked</span>
										</>
									)}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default AchievementsView;
