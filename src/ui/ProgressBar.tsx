import * as Progress from "@radix-ui/react-progress";

interface ProgressBarProps {
	value: number;
	className?: string;
}

const ProgressBar = ({ value, className }: ProgressBarProps) => {
	const percentage = Math.round(value);
	const showInside = value >= 20;

	return (
		<Progress.Root className={`progressbar ${className || ""}`} value={value} max={100}>
			<Progress.Indicator
				className="progressbar__indicator"
				style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
			>
				{showInside && <span className="progressbar__label">{percentage}%</span>}
			</Progress.Indicator>

			{!showInside && <span className="progressbar__label outside">{percentage}%</span>}
		</Progress.Root>
	);
};

export default ProgressBar;
