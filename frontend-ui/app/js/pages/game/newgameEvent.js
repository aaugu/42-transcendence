import { getGameID } from './gameplay/createnewGame.js'
import { urlRoute } from '../../dom/router.js';

export async function newlocalgameEvent(e) {
	const newGameId = await getGameID();
	const new_url = `/local-twoplayer/${newGameId}`;

	urlRoute(new_url);
}

export async function newAIgameEvent(e) {
	const newGameId = await getGameID();
	const new_url = `/local-ai/${newGameId}`;

	urlRoute(new_url);
}

export async function newremotegameEvent(e) {
	const newGameId = await getGameID();
	const new_url = `/remote-twoplayer/${newGameId}`;

	urlRoute(new_url);
}

export async function newtournamentgameEvent(e) {
	const newGameId = await getGameID();
	const new_url = `/tournament/${newGameId}`;

	urlRoute(new_url);
}