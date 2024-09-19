import { createGame, getGameMode } from '../game/gameplay/createnewGame.js';
import { userID } from '../user/updateProfile.js';

async function sendGameInvite(game_id, ctc_id) {
	const response = await fetch('https://localhost:10443/api/livechat/notification/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"user_id": userID,
			"target_id": ctc_id,
			"link": `<button id="chat-invite-game-link" data-gameid="${game_id}" data-senderid="${userID}" class="btn btn-primary" href='#'></button>`
		}),
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.status === 404)
			throw new Error('User does not exist');
		throw new Error(`${response.status}`);
	}

	console.log('USER LOG: SEND GAME INVITE SUCCESSFUL');

}

export async function inviteGameButton(ctc_id) {
	try {
		const mode = getGameMode("remote-twoplayer");
		const game = await createGame(mode);
		const game_id = game.game_id;
		await sendGameInvite(game_id, ctc_id);
	}
	catch (e) {
		console.log(`USER LOG: ${e.message}`);
	}

}