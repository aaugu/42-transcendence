import { tournamentOpenModal, tournamentCreateButton } from "./tournamentModal.js";

export async function tournamentEvent(e) {
	switch (e.target.id) {
		case "open-t-modal":
			tournamentOpenModal();
			break;
		case "t-modal-create":
			tournamentCreateButton();
			break;
		default:
			break;
	}

}