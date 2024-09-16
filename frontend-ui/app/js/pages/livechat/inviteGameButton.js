import { createGame, getGameMode } from '../game/gameplay/createnewGame.js';
import { userID } from '../user/updateProfile.js';

async function sendGameInvite(game_id, ctc_id) {
	const response = await fetch('https://localhost:10443/livechat/notification/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"player_1_or_sender": {
				"user_id": userID,
				"message": `<a id="chat-invite-game-link" data-gameid="${game_id}" data-senderid="${userID}" href='#'></a>`
			},
			"player_2_or_receiver": {
				"user_id": ctc_id,
				"message": `<a id="chat-invite-game-link" data-gameid="${game_id}" data-senderid="${userID}" href='#'></a>`
			}
		}),
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.status === 404)
			throw new Error('User does not exist');
		throw new Error(`${response.status}`);
	}
	const responseData = await response.json();
	if (responseData !== null) {
		console.log('USER LOG: INVITE TO GAME SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export async function inviteGameButton(ctc_id) {
	try {
		console.log("invite game button");
		const mode = getGameMode("remote-twoplayer");
		const game_id = await createGame(mode);
		await sendGameInvite(game_id, ctc_id);
	}
	catch (e) {
		console.log(`USER LOG: ${e.message}`);
	}

}