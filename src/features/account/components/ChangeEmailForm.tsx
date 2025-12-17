import { changeEmail } from "@/features/auth/data/auth";
import { getErrorMsg } from "@/lib/errors/getErrorMsg";
import { useAuthUser } from "@/store/useAuthStore";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

interface FormData {
	email: string;
}

const ChangeEmailForm = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const user = useAuthUser();
	const userEmail = user?.email || "";

	const { register, handleSubmit, reset } = useForm<FormData>();

	const onSubmit: SubmitHandler<FormData> = async ({ email }) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		if (email === userEmail) {
			setError("That’s already your current email.");
			setLoading(false);
			return;
		}

		try {
			await changeEmail(email);
			setSuccess(true);
			reset();
		} catch (err) {
			setError(getErrorMsg(err));
		} finally {
			setLoading(false);
		}
	};

	const formMessageClass = error ? "form-error-text" : "form-success-text";
	const formMessage = error ? error : "Check your new email to confirm the change.";

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="input-group">
				<p className={`${formMessageClass} ${!error && !success ? "hidden" : ""}`}>{formMessage}</p>

				<input
					type="email"
					placeholder="New email address"
					{...register("email", { required: true })}
				/>

				<button type="submit" disabled={loading}>
					{loading ? "Updating..." : "Change email"}
				</button>
			</div>
		</form>
	);
};

export default ChangeEmailForm;
