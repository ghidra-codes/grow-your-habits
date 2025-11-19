import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";

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
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<h2>Login</h2>
				{error && <p style={{ color: "red" }}>{error}</p>}

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
					{loading ? "Loading..." : "Log In"}
				</button>
			</form>

			<a href="/register">Register</a>
		</>
	);
};

export default LoginView;
