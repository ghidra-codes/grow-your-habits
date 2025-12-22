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
			console.log("err:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
				<h2>REGISTER</h2>

				<label htmlFor="email" className="sr-only">
					Email
				</label>
				<input
					type="email"
					placeholder="Email"
					{...formRegister("email", { required: "Email is required" })}
					aria-invalid={!!error}
					aria-describedby={error ? "register-error" : undefined}
					disabled={success}
					required
				/>

				<label htmlFor="password" className="sr-only">
					Password
				</label>
				<input
					type="password"
					placeholder="Password (min 6 characters)"
					{...formRegister("password", {
						required: "Password is required",
					})}
					aria-invalid={!!error}
					aria-describedby={error ? "register-error" : undefined}
					disabled={success}
					required
				/>

				{/* MESSAGE */}
				<p
					role={error ? "alert" : "status"}
					aria-live="polite"
					className={`auth-message ${error ? "auth-error" : "auth-success"} ${
						!error && !success ? "hidden" : ""
					}`}
				>
					{error ?? "We’ve sent you a confirmation email."}
				</p>

				<button type="submit" disabled={loading || success} aria-label="Register account">
					{success ? "Check your email" : loading ? "Creating Account..." : "Register"}
				</button>

				<div className="auth-link">
					{!success ? (
						<>
							Already have an account? <a href="/login">Log in</a>
						</>
					) : (
						<>
							Back to <a href="/login">Log in</a>
						</>
					)}
				</div>
			</form>
		</div>
	);
};

export default RegisterView;
