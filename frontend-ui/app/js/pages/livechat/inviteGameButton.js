import { createGame, getGameMode } from '../game/gameplay/createnewGame.js';
import { userID } from '../user/updateProfile.js';
import { urlRoute } from '../../dom/router.js'
import { errormsg } from '../../dom/errormsg.js';
import { getUserInfo } from "../user/getUserInfo.js";

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
			"link": `<button id="chat-invite-game-link" data-gameid="${game_id}" data-senderid="${userID}" class="btn btn-primary" href='#'>Join the game</button>`
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
		const userInfo = await getUserInfo(ctc_id);
		if (userInfo) {
			localStorage.setItem('right', userInfo.nickname);
			localStorage.setItem('left', localStorage.getItem('nickname'));
		}
		
		const mode = getGameMode("remote-twoplayer");
		const game = await createGame(mode);
		const game_id = game.game_id;
		await sendGameInvite(game_id, ctc_id);
		const new_url = `/remote-twoplayer/${game_id}`;
		urlRoute(new_url);
	}
	catch (e) {
		if (e.message === "500" || e.message === "502") {
			errormsg("Service temporarily unavailable", "livechat-conversation-errormsg")
			return ;
		}
		else if (e.message === "403") {
            updateProfile(false, null);
            errormsg('You were redirected to the landing page', 'homepage-errormsg');
            return '';
        }
	}

}