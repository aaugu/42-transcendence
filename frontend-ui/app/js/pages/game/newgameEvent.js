import { getGameID } from './gameplay/createnewGame.js'
import { urlRoute } from '../../dom/router.js';
import { hideModal } from '../../dom/modal.js';
import { errormsg } from '../../dom/errormsg.js';

export async function newlocalgameEvent(e) {
	const newGameId = await getGameID();
	if (newGameId) {
		const new_url = `/local-twoplayer/${newGameId}`;
		urlRoute(new_url);
	}
}

export async function newAIgameEvent(e) {
	const newGameId = await getGameID();
	if (newGameId) {
		const new_url = `/local-ai/${newGameId}`;
		urlRoute(new_url);
	}
}

export async function newremotegameEvent(e) {
	const newGameId = await getGameID();
	const new_url = `/remote-twoplayer/${newGameId}`;

	urlRoute(new_url);
}

export async function newtournamentgameEvent(tourn_id) {
	try { // ajouté un try/catch pour empêcher de changer d'url et emmener vers du not found
		if (tourn_id) {
			localStorage.setItem('tourn_id', tourn_id);
			const newGameId = await getGameID();
			const new_url = `/tournament/${newGameId}`;
			hideModal('single-t-modal');
			urlRoute(new_url);
		}
	} catch (e) {
		if (e.message === "500" || e.message === "502") {
			errormsg("Service temporarily unavailable", "single-t-modal-errormsg");
		
		}else if (e.message === "403") {
			updateProfile(false, null);
			errormsg('You were redirected to the landing page', 'homepage-errormsg');
		} 
		else {
			errormsg("This tournament cannot be started, try again later", 'single-t-modal');
		}
	}
}