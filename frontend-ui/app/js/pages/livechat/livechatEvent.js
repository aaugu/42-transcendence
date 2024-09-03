import { convHistory } from "./livechatConvHistory.js";
import { newConvButton }	from "./livechatNewConv.js";

export async function livechatEvent(e) {
	if (e.target.classList.contains('list-group-item') || e.target.parentElement.classList.contains('list-group-item')) {
        convHistory(e);
        return;
      }

	switch (e.target.id) {
		case "chat-search-btn":
			newConvButton(e);
			//search conversation by value submitted, display on the right if it exists, otherwise error;
			break;
		default:
			break;
	}

}