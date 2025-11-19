import { useState } from "react";
import { supabase } from "@/utils/supabase-client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";

interface RegisterFormData {
	email: string;
	password: string;
}

const RegisterView = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const { register, handleSubmit } = useForm<RegisterFormData>();

	const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
		setLoading(true);
		setError(null);

		const { error: authError } = await supabase.auth.signUp({
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
				<h2>Register</h2>

				{error && <p className="auth-message auth-message--error">{error}</p>}

				<input
					type="email"
					placeholder="Email"
					{...register("email", { required: "Email is required" })}
					required
				/>
				<input
					type="password"
					placeholder="Password (min 6 characters)"
					{...register("password", { required: "Password is required" })}
					required
				/>

				<button type="submit" disabled={loading}>
					{loading ? "Creating Account..." : "Register"}
				</button>

				<div className="auth-link">
					Already have an account? <a href="/login">Log in</a>
				</div>
			</form>
		</div>
	);
};

export default RegisterView;
