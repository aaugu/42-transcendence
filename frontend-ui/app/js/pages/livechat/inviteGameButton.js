import { createGame } from '../game/gameplay/WebSocketConnection.js';
import { userID } from '../user/updateProfile.js';

async function sendGameInvite(game_id, ctc_id) {
	const response = await fetch('https://localhost:10444/livechat/notification/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"player_1_or_sender": {
				"user_id": userID,
				"message": `Let's play Pong! Connect with game ID: ${game_id} under this link`
			},
			"player_2_or_receiver": {
				"user_id": ctc_id,
				"message": `Let's play Pong! Connect with game ID: ${game_id} under this link`
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
		const game_id = await createGame();
		await sendGameInvite(game_id, ctc_id);
	}
	catch (e) {
		console.log(`USER LOG: ${e.message}`);
	}

}