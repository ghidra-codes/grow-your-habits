import type { InsightConfidence } from "@/types/insight.types";

const InsightConfidenceBadge = ({ level, label, daysTracked }: InsightConfidence) => {
	return (
		<div className={`insight-confidence insight-confidence--${level}`}>
			<span className="label">{label}</span>

			<span className="meta">Time tracked: {daysTracked} days</span>
		</div>
	);
};

export default InsightConfidenceBadge;
