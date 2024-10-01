import { getGameID, getGameMode, createGame, createGameRemote } from '../game/gameplay/createnewGame.js';
import { userID } from '../user/updateProfile.js';
import { urlRoute } from '../../dom/router.js'
import { errormsg } from '../../dom/errormsg.js';
import { contact_blacklisted } from './blacklist.js';
import { getUserInfo } from "../user/getUserInfo.js";
import { isBlacklisted } from './blacklist.js';

async function sendGameInvite(game_id, ctc_id, mode) {
	let link;
	if (mode === "LOCAL_TWO_PLAYERS")
		  link = "go join them on their computer!";
	else
		  link = `<button id="chat-invite-game-link" data-gameid="${game_id}" data-senderid="${userID}" class="btn btn-primary" href='#'>Join the game</button>`

	const response = await fetch('https://' + window.location.host + '/api/livechat/notification/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"user_id": userID,
			"target_id": ctc_id,
			"link": link
		}),
		credentials: 'include'
	});
	if (!response.ok) {
		if (response.status === 404)
			throw new Error('User does not exist');
		throw new Error(`${response.status}`);
	}
}

export async function inviteGameButton(ctc_id) {
	if (contact_blacklisted) {
		errormsg("You blacklisted this contact, you cannot play pong", "livechat-conversation-errormsg");
		return;
	}

	try {
		const is_blacklisted = await isBlacklisted(ctc_id);
		if (is_blacklisted === true) {
			errormsg("Cannot invite contact to play pong", "livechat-conversation-errormsg");
			return;
		}
		const userInfo = await getUserInfo(ctc_id);
		if (userInfo) {
			localStorage.setItem('right', userInfo.nickname);
			localStorage.setItem('left', localStorage.getItem('nickname'));
		}

		// const game_id = await getGameID("remote-twoplayer");

		const mode = getGameMode("remote-twoplayer");
		const game = await createGameRemote(userID, ctc_id, mode);
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
		else {
			errormsg(e.message, 'homepage-errormsg');
		}
	}

}

export async function inviteGameButtonLocal(ctc_id) {
	if (contact_blacklisted) {
		errormsg("You blacklisted this contact, you cannot play pong", "livechat-conversation-errormsg");
		return;
	}
	try {
		const is_blacklisted = await isBlacklisted(ctc_id);
		if (is_blacklisted === true) {
			errormsg("Cannot invite contact to play pong", "livechat-conversation-errormsg");
			return;
		}
		const userInfo = await getUserInfo(ctc_id);
		if (userInfo) {
			localStorage.setItem('right', userInfo.nickname);
			localStorage.setItem('left', localStorage.getItem('nickname'));
		}

		const mode = getGameMode("local-twoplayer");
		const game = await createGame(mode, ctc_id);
		const game_id = game.game_id;
		await sendGameInvite(game_id, ctc_id, mode);
		const new_url = `/local-twoplayer/${game_id}`;
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