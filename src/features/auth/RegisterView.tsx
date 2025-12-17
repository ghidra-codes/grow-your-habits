import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { register } from "./data/auth";
import { getErrorMsg } from "@/lib/errors/getErrorMsg";

interface RegisterFormData {
	email: string;
	password: string;
}

const RegisterView = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const { register: formRegister, handleSubmit } = useForm<RegisterFormData>();

	const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			await register(data);
			setSuccess(true);
		} catch (err) {
			setError(getErrorMsg(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
				<h2>REGISTER</h2>

				<input
					type="email"
					placeholder="Email"
					{...formRegister("email", { required: "Email is required" })}
					required
					disabled={success}
				/>
				<input
					type="password"
					placeholder="Password (min 6 characters)"
					{...formRegister("password", {
						required: "Password is required",
					})}
					required
					disabled={success}
				/>

				{/* MESSAGE */}
				<p
					className={`auth-message ${error ? "auth-error" : "auth-success"} ${
						!error && !success ? "hidden" : ""
					}`}
				>
					{error ?? "We’ve sent you a confirmation email."}
				</p>

				<button type="submit" disabled={loading || success}>
					{success ? "Check your email" : loading ? "Creating Account..." : "Register"}
				</button>

				{!success && (
					<div className="auth-link">
						Already have an account? <a href="/login">Log in</a>
					</div>
				)}
			</form>
		</div>
	);
};

export default RegisterView;
