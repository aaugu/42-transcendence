import { userID } from "../../user/updateProfile.js";
import createWebSocketConnection from "../gameplay/WebSocketConnection.js";
import { displayGame } from "../gameplay/displayGame.js";

export function joinGameEvent() {
    const joinButton = document.getElementById("join-button");
    joinButton.addEventListener("click", async () => {
        const gameId = document.getElementById("game-id-input").value;
        console.log("GameID entered by user:", gameId);
        if (gameId) {
            try {
                console.log("TRY GAME JOIN FUNCTION");
                const socket = await joinGame(gameId);
                console.log("JOIN GAME SUCCESS");
                displayGame(socket);
            }
            catch (error) {
                console.error("JOIN GAME ERROR:", error);
            }
        }
        else {
            console.error("JOIN GAME ERROR: No GameID entered by user");
        }
    })
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

    const socket = await createWebSocketConnection(gameId);

    return socket;

  } catch(error) {
    console.error("JOIN GAME ERROR:", error);
  }
}