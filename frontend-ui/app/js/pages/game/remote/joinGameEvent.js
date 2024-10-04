import { userID } from "../../user/updateProfile.js";
import { displayGame } from "../gameplay/displayGame.js";
import { handleWebsocketGame } from "../gameplay/handleWebsocket.js";
import handleButtons from "../gameplay/HandleButtons.js";
import handleKeyPress from "../gameplay/HandleKeyPress.js";
import { joinRemoteGame } from "../../livechat/joinRemoteGame.js";
import { escapeHTML } from "../../livechat/startLivechat.js";

export function joinGameEvent(event) {
	switch (event.target.id){
		case "chat-invite-game-link":
			const game_id = escapeHTML(document.getElementById("game-id").value);
			const sender_id = 0;

			joinRemoteGame(game_id, sender_id);
			break;
		default :
			break;
	}
}