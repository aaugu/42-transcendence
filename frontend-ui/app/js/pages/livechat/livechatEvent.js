import { convHistory } from "./convHistory.js";
import { newConvButton }	from "./newConv.js";
import { blockUser, colorBlockButton, contact_blacklisted, set_contact_blacklisted, unblockUser } from "./blacklist.js";
import { errormsg } from "../../dom/errormsg.js";
import { chatSocket } from "./startLivechat.js";
import { inviteGameButton } from "./inviteGameButton.js";
import { joinGameandRedirect } from "../game/remote/joinGameandRedirect.js";
import { userID } from "../user/updateProfile.js";
import { urlRoute } from "../../dom/router.js";
import { inviteGameButtonLocal } from "./inviteGameButton.js";

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
	if (target.tagName === 'I' && target.parentElement.id === 'chat-block-btn') {
		target = target.parentElement;
	}
	else if (target.tagName === 'I' && target.parentElement.id === 'chat-invite-game') {
		target = target.parentElement;
	} else if (target.tagName === 'I' && target.parentElement.id === 'chat-invite-game-local') {
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
					return ;
				}
				console.log(`USER LOG: ${e.message}`);
				errormsg(e.message, 'livechat-errormsg');
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
			joinGameandRedirect(game_id, sender_id);
			break;
		case "ctc-nickname":
			const nickname = target.textContent;
			urlRoute(`/profile/${nickname}`);
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