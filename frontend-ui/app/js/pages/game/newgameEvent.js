import { getGameID } from './gameplay/createnewGame.js'
import { urlRoute } from '../../dom/router.js';
import { hideModal } from '../../dom/modal.js';
import { errormsg } from '../../dom/errormsg.js';

export async function newlocalgameEvent(e) {
	// const newGameId = await getGameID();
	// if (newGameId) {
	// 	const new_url = `/local-twoplayer/${newGameId}`;
	// 	urlRoute(new_url);
	// }
}

export async function newAIgameEvent(e) {
	// const newGameId = await getGameID();
	// if (newGameId) {
	// 	const new_url = `/local-ai/${newGameId}`;
	// 	urlRoute(new_url);
	// }
}

export async function newremotegameEvent(e) {
	// const newGameId = await getGameID();
	// const new_url = `/remote-twoplayer/${newGameId}`;

	// urlRoute(new_url);
}

export async function newtournamentgameEvent(tourn_id) {
	// if (tourn_id) {
	// 	const new_url = `/tournament/${tourn_id}`;
	// 	hideModal('single-t-modal');
	// 	urlRoute(new_url);
	// }
	// errormsg("This tournament cannot be started, try again later", 'single-t-modal');
}