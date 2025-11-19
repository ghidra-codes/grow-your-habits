import { supabase } from "@/utils/supabase-client";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";

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

		const { error: authError } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});

		if (authError) {
			setError(authError.message);
		} else {
			navigate("/");
		}

		setLoading(false);
	};

	return (
		<div className="auth-container">
			<form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
				<h2>Login</h2>
				{error && <p className="auth-message auth-message--error">{error}</p>}

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
