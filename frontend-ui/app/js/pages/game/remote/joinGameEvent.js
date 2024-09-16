import { userID } from "../../user/updateProfile.js";
import createWebSocketConnection from "../gameplay/WebSocketConnection.js";
import { displayGame } from "../gameplay/displayGame.js";
import { handleWebsocketGame } from "../gameplay/handleWebsocket.js";
import handleButtons from "../gameplay/HandleButtons.js";
import handleKeyPress from "../gameplay/HandleKeyPress.js";
import { joinGameandRedirect } from "./joinGameandRedirect.js";

export function joinGameEvent(event) {
    const joinButton = document.getElementById("join-game-btn");
    // if (event.target === joinButton) {
    //   const gameId = document.getElementById("game-id-input").value;
    //   joinGameandRedirect(gameId);
    // }
    switch (event.target.id){
      case "chat-invite-game-link":
        console.log("event.target:", event.target);
        const game_id = event.target.dataset.gameid;
        const sender_id = event.target.dataset.senderid;

        console.log("game_id in event:", game_id);
        console.log("sender_id in event:", sender_id);
        joinGameandRedirect(game_id, sender_id);
        break;
      default :
          break;
			
}
    // joinButton.addEventListener("click", async () => {
    //     const gameId = document.getElementById("game-id-input").value;
    //     console.log("GameID entered by user:", gameId);
    //     if (gameId !== "") {
    //         try {
    //             console.log("TRY GAME JOIN FUNCTION");
    //             const j_socket = await joinGame(gameId);
    //             console.log("JOIN GAME SUCCESS");
    //             const canvas = displayGame();
    //             handleWebsocketGame(j_socket, canvas);
    //             handleButtons(j_socket);

    //             let keysPressed = {};
    //             document.addEventListener("keydown", function (event) {
    //               keysPressed[event.key] = true;
    //               handleKeyPress(keysPressed, j_socket);
    //             });

    //             document.addEventListener("keyup", function (event) {
    //               keysPressed[event.key] = false;
    //               handleKeyPress(keysPressed, j_socket);
    //             });
    //         }
    //         catch (error) {
    //             console.error("JOIN GAME ERROR:", error);
    //         }
    //     }
    //     else {
    //         console.error("JOIN GAME ERROR: No GameID entered by user");
    //     }
    // })
}

export async function joinGame(gameId) {

  const joinGameEndpoint = "https://localhost:10444/pong/join-game";

  try {
    const response = await fetch(`${joinGameEndpoint}/${gameId}/${userID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`Failed to join game. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("JOIN GAME RESPONSE:", data);

    const socket = new WebSocket(`ws://localhost:9000/ws/pong/${gameId}`);

    return socket;

  } catch(error) {
    console.error("JOIN GAME ERROR:", error);
  }
}