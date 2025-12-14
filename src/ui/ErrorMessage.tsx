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
		<div className="error-message-wrapper" role="alert">
			<h3 className="error-message-title">{title}</h3>
			<p className="error-message-text">{message}</p>
			<small className="error-message">{errorMessage}</small>

			<button className="error-message-retry-btn" onClick={() => window.location.reload()}>
				Retry
			</button>
		</div>
	);
};

export default ErrorMessage;
