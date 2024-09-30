import { userID } from "../../user/updateProfile.js";
import { displayGame } from "../gameplay/displayGame.js";
import { handleWebsocketGame } from "../gameplay/handleWebsocket.js";
import handleButtons from "../gameplay/HandleButtons.js";
import handleKeyPress from "../gameplay/HandleKeyPress.js";
import { joinRemoteGame } from "../../livechat/joinRemoteGame.js";

export function joinGameEvent(event) {
    switch (event.target.id){
      case "chat-invite-game-link":
        console.log("event.target:", event.target);
        const game_id = document.getElementById("game-id").value;
        const sender_id = 0;

        joinRemoteGame(game_id, sender_id);
        break;
      default :
          break;
		}
}