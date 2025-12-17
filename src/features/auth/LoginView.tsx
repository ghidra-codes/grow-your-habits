import { getErrorMsg } from "@/lib/errors/getErrorMsg";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { login } from "./data/auth";

interface LoginFormData {
	email: string;
	password: string;
}

const LoginView = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();

	const { register, handleSubmit } = useForm<LoginFormData>();

	const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
		setLoading(true);
		setError(null);

		try {
			await login(data);
			navigate("/");
		} catch (err) {
			setError(getErrorMsg(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
				<h2>LOGIN</h2>

				<input
					type="email"
					placeholder="Email"
					{...register("email", { required: "Email is required" })}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					{...register("password", { required: "Password is required" })}
					required
				/>

				<p className={`auth-message auth-error ${!error && "hidden"}`}>{error}</p>

				<button type="submit" disabled={loading}>
					{loading ? "Logging In..." : "Log In"}
				</button>

				<div className="auth-link">
					Need an account? <a href="/register">Register here</a>
				</div>
			</form>
		</div>
	);
};

export default LoginView;
