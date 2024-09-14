import { openCreateTournamentModal, openSingleTournamentModal } from "./tournamentModals.js";
import { createTournamentButton } from "./createTournament.js";
import { joinTournamentButton } from "./joinTournament.js";
import { urlRoute } from "../../dom/router.js";
import { hideModal } from "../../dom/modal.js";

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
			const tourn_id = document.getElementById('t-start').dataset.tournid;
			localStorage.setItem('tourn_id', tourn_id);
			hideModal('single-t-modal');
			urlRoute('/tournament');
			break;
		case "t-play":
			break;
		default:
			break;
	}

}