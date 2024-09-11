import { userID } from "../../user/updateProfile.js";

const gatewayEndpoint = "https://localhost:10444/pong";

export async function createGame(userID, mode) {
  const response = await fetch(
    `${gatewayEndpoint}/create-game/${userID}/${mode}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const data = await response.json();

  console.log(JSON.stringify(data));

  return data;
}

export default async function createWebSocketConnection() {
  // const socket = new WebSocket("ws://" + window.location.host + "/ws/pong/");

  // Generate a unique ID

  const currentUrl = window.location.href;

  var mode = currentUrl.split("/")[3];

  console.log(`MODE: ${mode}, USER ID: ${userID}`);


  switch (mode) {
    case "local-twoplayer":
      mode = "LOCAL_TWO_PLAYERS";
      break;
    // case "local-oneplayer":
    //   mode = "LOCAL_ONE_PLAYER";
    //   break;
    // case "online-twoplayer":
    //   mode = "ONLINE_TWO_PLAYERS";
    //   break;
    // case "online-oneplayer":
    //   mode = "ONLINE_ONE_PLAYER";
    //   break;
    default:
      console.log("Invalid mode");
  }

  const gameData = await createGame(userID, mode);

  history.replaceState({}, '', `${currentUrl}/${gameData.game_id}`);

  const socket = new WebSocket(`ws://localhost:9000/ws/pong/${gameData.game_id}`);

  return socket;
}
