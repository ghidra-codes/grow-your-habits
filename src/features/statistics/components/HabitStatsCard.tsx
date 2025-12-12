import { useHabitAdherence } from "@/features/habits/hooks/derived/useHabitAdherence";
import { useRecentAdherence } from "@/features/habits/hooks/derived/useRecentAdherence";
import { calculateTrendDirection } from "@/lib/calculateTrendDirection";
import type { FrequencyType, HabitWithLogs } from "@/types/habit.types";
import type { TimelineModesMap, TimelineViewMode } from "@/types/statistic.types";
import ProgressBar from "@/ui/ProgressBar";
import Select from "@/ui/Select";
import type { EmblaCarouselType } from "embla-carousel";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { PiArrowFatLineDown, PiArrowFatLineUp, PiArrowFatRight } from "react-icons/pi";
import { FREQUENCY_LABELS } from "../constants/stats-card";
import useEmblaNavigation from "../hooks/useEmblaNavigation";
import { useStatsStreak } from "../hooks/useStatsStreak";
import StreakBar from "./StreakBar";
import TimelineRenderer from "./timeline/TimelineRenderer";

interface HabitStatsCardProps {
	habit: HabitWithLogs;
	frequency: FrequencyType;
	timelineModes: TimelineModesMap;
	setTimelineModes: React.Dispatch<React.SetStateAction<TimelineModesMap>>;
	emblaApi: EmblaCarouselType | null;
}

const HabitStatsCard = ({
	habit,
	frequency,
	timelineModes,
	setTimelineModes,
	emblaApi,
}: HabitStatsCardProps) => {
	const mode: TimelineViewMode = timelineModes[habit.id] ?? "weekly";

	// GET HABIT STATS

	const adherence = useHabitAdherence(habit);
	const recent = useRecentAdherence(habit);
	const streak = useStatsStreak(habit);
	const trend = calculateTrendDirection(habit, frequency);

	// EMBLA NAVIGATION

	const { canPrev, canNext, onPrev, onNext } = useEmblaNavigation(emblaApi);

	// ADHERENCE STATS

	const ADHERENCE_STATS = [
		{ label: "Overall", value: adherence.percentage || 0 },
		{ label: "Last 7 days", value: recent?.last7 || 0, class: "short-term" },
		{ label: "Last 30 days", value: recent?.last30 || 0, class: "long-term" },
	];

	const TREND_ICONS = {
		improving: <PiArrowFatLineUp className="trend-icon__improving" size={21} />,
		stable: <PiArrowFatRight className="trend-icon__stable" size={21} />,
		declining: <PiArrowFatLineDown className="trend-icon__declining" size={21} />,
	};

	return (
		<div className="habit-stats-card">
			<div className="habit-stats-card__nav">
				<button
					className="habit-stats-card__arrow habit-stats-card__arrow--left"
					onClick={onPrev}
					disabled={!canPrev}
					aria-label="Previous habit"
				>
					<FaAngleLeft size={32} />
				</button>

				<h2>{habit.name}</h2>

				<button
					className="habit-stats-card__arrow habit-stats-card__arrow--right"
					onClick={onNext}
					disabled={!canNext}
					aria-label="Next habit"
				>
					<FaAngleRight size={32} />
				</button>
			</div>

			<h3 className="habit-name">
				Habit name:
				<span>{habit.name}</span>
			</h3>

			{/* STREAKS */}
			<div className="stats-section-heading">
				<h2>STREAKS</h2>
				<div className="divider" />
			</div>
			<div className="streak-container">
				<div className="current-streak">
					<div className="streak-info">
						<h3>
							Current streak:{" "}
							<span>
								{streak.currentStreak || 0} {FREQUENCY_LABELS[frequency]}
							</span>
						</h3>

						{streak.currentStreak > 12 && (
							<span className="streak-overflow-label">+{streak.currentStreak - 12}</span>
						)}
					</div>

					<StreakBar streak={streak.currentStreak || 0} />
				</div>

				<div className="longest-streak">
					<h3>
						Longest streak:{" "}
						<span>
							{streak.longestStreak || 0} {FREQUENCY_LABELS[frequency]}
						</span>
					</h3>
				</div>
			</div>

			{/* ADHERENCE */}
			<div className="stats-section-heading">
				<h2>ADHERENCE</h2>
				<div className="divider" />
			</div>

			{ADHERENCE_STATS.map((stat) => (
				<div className="progressbar-container" key={stat.label}>
					<h3>{stat.label}:</h3>
					<ProgressBar value={stat.value} indicatorClass={stat.class || ""} />
				</div>
			))}

			{/* TREND */}
			<div className="trend-container">
				<h3>Trend:</h3>
				<div className={`trend-info trend-${trend}`}>
					{TREND_ICONS[trend]}
					<span className="trend-label">{trend}</span>
				</div>
			</div>

			<div className="stats-section-heading">
				<h2>TIMELINE</h2>
				<div className="divider" />
			</div>

			{/* TIMELINE */}
			<div className="timeline-container">
				<div className="timeline-info">
					<h3>Mode:</h3>

					{frequency === "daily" && (
						<Select<TimelineViewMode>
							value={mode}
							className="timeline-mode-select"
							onChange={(value) =>
								setTimelineModes((prev) => ({
									...prev,
									[habit.id]: value,
								}))
							}
							options={[
								{ value: "monthly", label: "Monthly" },
								{ value: "weekly", label: "Weekly" },
							]}
						/>
					)}
				</div>

				<TimelineRenderer frequency={frequency} habit={habit} mode={mode} />
			</div>
		</div>
	);
};

export default HabitStatsCard;
