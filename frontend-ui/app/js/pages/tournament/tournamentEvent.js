import { openCreateTournamentModal, tournamentCreateButton, openSingleTournamentModal } from "./tournamentModals.js";

export async function tournamentEvent(e) {
	if (e.target.classList.contains('list-group-item') || e.target.parentElement.classList.contains('list-group-item')) {
        openSingleTournamentModal(e);
        return;
      }

	switch (e.target.id) {
		case "open-create-t-modal":
			openCreateTournamentModal();
			break;
		case "t-create":
			tournamentCreateButton();
			break;
		case "t-join":
			// console.log("All tournaments");
			break;
		case "t-start":
			// console.log("All tournaments");
			break;
		case "t-play":
			break;
		default:
			break;
	}

}