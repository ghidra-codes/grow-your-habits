import { useState } from "react";
import { supabase } from "@/utils/supabase";
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

	const [message, setMessage] = useState<string | null>(null);

	const { register, handleSubmit } = useForm<RegisterFormData>();

	const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
		setLoading(true);
		setError(null);
		setMessage(null);

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
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2>Register</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			{message && <p style={{ color: "green" }}>{message}</p>}

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
		</form>
	);
};

export default RegisterView;
