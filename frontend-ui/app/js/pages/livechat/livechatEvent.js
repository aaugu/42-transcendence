import { convHistory } from "./convHistory.js";
import { newConvButton }	from "./newConv.js";
import { blockUser, colorBlockButton, is_blacklisted, set_is_blacklisted, unblockUser } from "./blacklist.js";

export async function livechatEvent(e) {
	if (e.target.classList.contains('list-group-item') || e.target.parentElement.classList.contains('list-group-item')) {
        convHistory(e);
        return;
      }

	let target = e.target;
	if (target.tagName === 'I' && target.parentElement.id === 'chat-block-btn') {
		target = target.parentElement;
	}

	switch (target.id) {
		case "chat-search-btn":
			newConvButton(e);
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
			}
			break;
		default:
			break;
	}

}