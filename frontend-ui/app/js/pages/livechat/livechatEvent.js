import { convHistory } from "./convHistory.js";
import { newConvButton }	from "./newConv.js";
import { blockUser, colorBlockButton, contact_blacklisted, set_contact_blacklisted, unblockUser } from "./blacklist.js";
import { errormsg } from "../../dom/errormsg.js";
import { chatSocket } from "./startLivechat.js";
import { inviteGameButton } from "./inviteGameButton.js";
import { joinRemoteGame } from "./joinRemoteGame.js";
import { urlRoute } from "../../dom/router.js";
import { inviteGameButtonLocal } from "./inviteGameButton.js";
import { updateProfile } from "../user/updateProfile.js";

export async function livechatEvent(e) {
	if (e.target.classList.contains('list-group-item') || e.target.parentElement.classList.contains('list-group-item')) {
        if (chatSocket) {
			if (chatSocket.readyState == 1) {
				chatSocket.close();
			}
		}
		convHistory(e);
        return;
      }

	let target = e.target;
	if (target.tagName === 'I' && (target.parentElement.id === 'chat-invite-game'
		|| target.parentElement.id === 'chat-invite-game-local'
		|| target.parentElement.id === 'chat-block-btn')) {
		target = target.parentElement;
	}

	switch (target.id) {
		case "chat-search-btn":
			if (chatSocket) {
				if (chatSocket.readyState == 1) {
					chatSocket.close();
				}
			}
			newConvButton();
			break;
		case "chat-block-btn":
			try {
				const ctc_id = target.dataset.ctcid;
				if (contact_blacklisted === false) {
					await blockUser(ctc_id);
					set_contact_blacklisted(true);
					colorBlockButton();
				}
				else {
					await unblockUser(ctc_id);
					set_contact_blacklisted(false);
					colorBlockButton();
				}
			}
			catch (e) {
				if (e.message === "500" || e.message === "502") {
					errormsg("Service temporarily unavailable", "livechat-conversation-errormsg");
				} else if (e.message === "403" || e.message === "401") {
					updateProfile(false, null);
					errormsg('You were redirected to the landing page', 'homepage-errormsg');
				} else {
					errormsg(e.message, 'homepage-errormsg');
				}
			}
			break;
		case "chat-invite-game":
			const ctc_id = target.dataset.ctcid;
			inviteGameButton(ctc_id);
			break;
		case "chat-invite-game-local":
			const ctc_id_local = target.dataset.ctcid;
			inviteGameButtonLocal(ctc_id_local);
			break;
		case "chat-invite-game-link":
			const game_id = target.dataset.gameid;
			const sender_id = target.dataset.senderid;
			const receiver_id = target.dataset.receiverid;
			joinRemoteGame(game_id, sender_id, receiver_id);
			break;
		case "t-remote-match-link":
			const gameurl = target.dataset.gameurl;
			const tourn_id = target.dataset.tournid;
			localStorage.setItem('tourn_id', tourn_id);
			urlRoute(gameurl);
			break;
		default:
			break;
	}

}