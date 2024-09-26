import { openCreateTournamentModal, openSingleTournamentModal } from "./tournamentModals.js";
import { createTournamentButton } from "./createTournament.js";
import { joinTournamentButton } from "./joinTournament.js";
import { urlRoute } from "../../dom/router.js";
import { hideModal } from "../../dom/modal.js";
import { newtournamentgameEvent } from "../game/newgameEvent.js";
import { deleteTournament } from "./deleteTournament.js";
import { updateTournLists } from "./updateTournLists.js";
import { errormsg } from "../../dom/errormsg.js";

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
			const tourn_id_start = document.getElementById('t-start').dataset.tournid;
			newtournamentgameEvent(tourn_id_start);
			break;
		case "t-delete":
			const tourn_id_delete = document.getElementById('t-delete').dataset.tournid;
			try {
				await deleteTournament(tourn_id_delete);
				updateTournLists();
				hideModal('single-t-modal');
			} catch (e) {
				if (e.message === "500" || e.message === "502") {
					errormsg("Service temporarily unavailable", "single-t-modal-errormsg");
					break ;
				}
				console.error("USER LOG: ", e.message);
			}
			break;
		case "t-play":
			break;
		default:
			break;
	}

}