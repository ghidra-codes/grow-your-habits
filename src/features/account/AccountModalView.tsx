import { useAuthLoading, useAuthUser } from "@/store/useAuthStore";
import { logout } from "../auth/data/auth";
import ChangeEmailForm from "./components/ChangeEmailForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import { LuLogOut } from "react-icons/lu";

const AccountModal = () => {
	const user = useAuthUser();
	const loading = useAuthLoading();

	if (loading || !user) return null;

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<>
			<section className="account-modal-section email">
				<div className="account-section-heading">
					<h3>Email</h3>
					<div className="divider" />
				</div>

				<p className="account-hint">
					Current email: <span>{user.email}</span>
				</p>

				<ChangeEmailForm />
			</section>

			<section className="account-modal-section password">
				<div className="account-section-heading">
					<h3>Password</h3>
					<div className="divider" />
				</div>

				<ChangePasswordForm />
			</section>

			<div>
				<button className="account-logout-button" onClick={handleLogout} type="button">
					<LuLogOut size={20} />
					<span>Log out</span>
				</button>
			</div>
		</>
	);
};

export default AccountModal;
