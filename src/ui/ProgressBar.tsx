import * as Progress from "@radix-ui/react-progress";

interface ProgressBarProps {
	value: number;
	indicatorClass?: string;
}

const ProgressBar = ({ value, indicatorClass }: ProgressBarProps) => {
	const percentage = Math.round(value);
	const showInside = value >= 20;

	return (
		<Progress.Root className="progressbar" value={value} max={100}>
			<Progress.Indicator
				className={`progressbar__indicator ${indicatorClass || ""}`}
				style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
			>
				{showInside && <span className="progressbar__label">{percentage}%</span>}
			</Progress.Indicator>

			{!showInside && <span className="progressbar__label outside">{percentage}%</span>}
		</Progress.Root>
	);
};

export default ProgressBar;
