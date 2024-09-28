import { userID } from "../../user/updateProfile.js";
import { displayGame } from "../gameplay/displayGame.js";
import { handleWebsocketGame } from "../gameplay/handleWebsocket.js";
import handleButtons from "../gameplay/HandleButtons.js";
import handleKeyPress from "../gameplay/HandleKeyPress.js";
import { joinGameandRedirect } from "./joinGameandRedirect.js";

export function joinGameEvent(event) {
    switch (event.target.id){
      case "chat-invite-game-link":
        console.log("event.target:", event.target);
        const game_id = document.getElementById("game-id").value;
        const sender_id = 0;

        // console.log("game_id in event:", game_id);
        // console.log("sender_id in event:", sender_id);
        joinGameandRedirect(game_id, sender_id);
        break;
      default :
          break;
		}
}