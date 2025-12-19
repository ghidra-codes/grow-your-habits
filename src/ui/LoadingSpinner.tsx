import { ScaleLoader } from "react-spinners";

const LoadingSpinner = () => (
	<div className="loading-wrapper" role="status" aria-live="polite" aria-label="Loading">
		<ScaleLoader color={"#a2c7a7"} />
	</div>
);

export default LoadingSpinner;
