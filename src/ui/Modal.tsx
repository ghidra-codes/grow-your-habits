import * as Dialog from "@radix-ui/react-dialog";
import { IoCloseCircleOutline } from "react-icons/io5";
import type React from "react";

interface ModalProps {
	isOpen: boolean;
	handleClose: () => void;
	title: string;
	description: string;
	children: React.ReactNode;
	containerClass?: string;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	handleClose,
	title,
	description,
	children,
	containerClass,
}) => (
	<Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
		<Dialog.Portal>
			<Dialog.Overlay className="modal-overlay" />

			<Dialog.Content className={`modal-content-container ${containerClass || ""}`}>
				<div className="modal-header">
					<Dialog.Title className="modal-title">{title}</Dialog.Title>
					<Dialog.Close className="modal-close-btn">
						<IoCloseCircleOutline size={32} />
					</Dialog.Close>
				</div>

				<Dialog.Description className="modal-description">{description}</Dialog.Description>

				<div>{children}</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
);

export default Modal;
