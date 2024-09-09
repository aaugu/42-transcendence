import { convHistory } from "./convHistory.js";
import { newConvButton }	from "./newConv.js";
// import { blockUser } from "./block.js";

export async function livechatEvent(e) {
	if (e.target.classList.contains('list-group-item') || e.target.parentElement.classList.contains('list-group-item')) {
        convHistory(e);
        return;
      }

	switch (e.target.id) {
		case "chat-search-btn":
			newConvButton(e);
			break;
		case "chat-block-btn":
			// try {
			// 	await blockUser(e.target.parentElement.parentElement.querySelector('span').dataset.convid);
			// }
			// catch (e) {
			// 	console.log(`USER LOG: ${e.message}`);
			// }
			break;
		default:
			break;
	}

}