import { useEffect } from "react";
import { useNavigate } from "react-router";

const ConfirmEmailView = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/", { replace: true });
		}, 1000000);

		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div className="auth-container">
			<div className="auth-form confirm-email-view">
				<h2>EMAIL CONFIRMED</h2>

				<p className="auth-message auth-success">Your email has been successfully confirmed.</p>

				<span className="auth-redirect-text">Redirecting you to the app…</span>
			</div>
		</div>
	);
};

export default ConfirmEmailView;
