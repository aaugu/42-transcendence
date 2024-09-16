import { convHistory } from "./convHistory.js";
import { newConvButton }	from "./newConv.js";
import { blockUser, colorBlockButton, is_blacklisted, set_is_blacklisted, unblockUser } from "./blacklist.js";
import { errormsg } from "../../dom/errormsg.js";
import { chatSocket } from "./startLivechat.js";

export async function livechatEvent(e) {
	if (e.target.classList.contains('list-group-item') || e.target.parentElement.classList.contains('list-group-item')) {
        if (chatSocket) { // close ws
			chatSocket.close();
			console.log('LIVE CHAT: Websocket connection closed');
		}
		convHistory(e);
        return;
      }

	let target = e.target;
	if (target.tagName === 'I' && target.parentElement.id === 'chat-block-btn') {
		target = target.parentElement;
	}

	switch (target.id) {
		case "chat-search-btn":
			if (chatSocket) { // close ws
				chatSocket.close();
				console.log('LIVE CHAT: Websocket connection closed');
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
		default:
			break;
	}

}