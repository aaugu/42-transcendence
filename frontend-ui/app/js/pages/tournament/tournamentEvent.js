import { openCreateTournamentModal, openSingleTournamentModal } from "./tournamentModals.js";
import { createTournamentButton } from "./createTournament.js";
import { joinTournamentButton } from "./joinTournament.js";
import { startTournamentButton } from "./startTournament.js";

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
			createTournamentButton();
			break;
		case "t-join":
			joinTournamentButton();
			break;
		case "t-start":
			startTournamentButton();
			break;
		case "t-play":
			break;
		default:
			break;
	}

}