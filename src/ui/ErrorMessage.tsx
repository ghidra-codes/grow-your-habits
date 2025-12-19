import type React from "react";

interface ErrorMessageProps {
	title?: string;
	message?: string;
	errorMessage?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
	title = "Something went wrong",
	message = "We couldn’t load this right now. Please try again in a moment.",
	errorMessage,
}) => {
	return (
		<div className="error-message-wrapper" role="alert" aria-live="assertive" aria-atomic="true">
			<h3 className="error-message-title">{title}</h3>
			<p className="error-message-text">{message}</p>

			{errorMessage && (
				<small className="error-message" aria-hidden="true">
					{errorMessage}
				</small>
			)}

			<button
				className="error-message-retry-btn"
				onClick={() => window.location.reload()}
				aria-label="Retry loading the page"
			>
				Retry
			</button>
		</div>
	);
};

export default ErrorMessage;
