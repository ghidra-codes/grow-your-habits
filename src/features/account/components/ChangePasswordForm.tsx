import { changePassword } from "@/features/auth/data/auth";
import { getErrorMsg } from "@/lib/errors/getErrorMsg";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

interface FormData {
	password: string;
}

const ChangePasswordForm = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const { register, handleSubmit, reset } = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = async ({ password }) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			await changePassword(password);
			setSuccess(true);
			reset();
		} catch (err) {
			setError(getErrorMsg(err));
		} finally {
			setLoading(false);
		}
	};

	const formMessageClass = error ? "form-error-text" : "form-success-text";
	const formMessage = error ? error : "Password updated successfully.";

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="input-group">
				<p
					id="password-form-message"
					className={`${formMessageClass} ${!error && !success ? "hidden" : ""}`}
					role="alert"
				>
					{formMessage}
				</p>

				<label htmlFor="new-password" className="sr-only">
					New password
				</label>

				<input
					id="new-password"
					type="password"
					placeholder="New password"
					aria-invalid={!!error}
					aria-describedby={error || success ? "password-form-message" : undefined}
					{...register("password", { required: true, minLength: 6 })}
				/>

				<button type="submit" disabled={loading}>
					{loading ? "Updating..." : "Change password"}
				</button>
			</div>
		</form>
	);
};

export default ChangePasswordForm;
