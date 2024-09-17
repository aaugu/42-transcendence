import { convHistory } from "./convHistory.js";
import { newConvButton }	from "./newConv.js";
import { blockUser, colorBlockButton, is_blacklisted, set_is_blacklisted, unblockUser } from "./blacklist.js";
import { errormsg } from "../../dom/errormsg.js";
import { chatSocket } from "./startLivechat.js";
import { inviteGameButton } from "./inviteGameButton.js";
import { joinGameandRedirect } from "../game/remote/joinGameandRedirect.js";
import { userID } from "../user/updateProfile.js";

export async function livechatEvent(e) {
	if (e.target.classList.contains('list-group-item') || e.target.parentElement.classList.contains('list-group-item')) {
        if (chatSocket) {
			if (chatSocket.readyState == 1) {
				chatSocket.close();
				console.log('LIVE CHAT: Websocket connection closed');
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
	}

	switch (target.id) {
		case "chat-search-btn":
			if (chatSocket) {
				if (chatSocket.readyState == 1) {
					chatSocket.close();
					console.log('LIVE CHAT: Websocket connection closed');
				}
			}
			newConvButton();
			break;
		case "chat-block-btn":
			try {
				const ctc_id = target.dataset.ctcid;
				if (is_blacklisted === false) {
					await blockUser(ctc_id);
					set_is_blacklisted(true);
					colorBlockButton();
				}
				else {
					await unblockUser(ctc_id);
					set_is_blacklisted(false);
					colorBlockButton();
				}
			}
			catch (e) {
				console.log(`USER LOG: ${e.message}`);
				errormsg(e.message, 'livechat-errormsg');
			}
			break;
		case "chat-invite-game":
			const ctc_id = target.dataset.ctcid;
			inviteGameButton(ctc_id);
			break;
		case "chat-invite-game-link":
			const game_id = target.dataset.gameid;
			const sender_id = target.dataset.senderid;
			joinGameandRedirect(game_id, sender_id);
			break;
		default:
			break;
	}

}