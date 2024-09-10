import {userID} from "../../user/updateProfile.js";

const gatewayEndpoint = "https://localhost:10444/pong";

export async function createGame(userID, mode) {
  const response = await fetch(`${gatewayEndpoint}/create-game/${userID}/${mode}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

export default async function createWebSocketConnection() {
  // const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

  // Generate a unique ID

  const currentUrl = window.location.href;

  const mode = currentUrl.split("/")[3];

  console.log(`Game and URLS: ${currentUrl} ${mode} ${userID}`);

  const gameData = await createGame(userID, mode);

  console.log(gameData);

}