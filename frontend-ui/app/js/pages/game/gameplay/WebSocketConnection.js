import { userID } from "../../user/updateProfile.js";

const gatewayEndpoint = "https://localhost:10444/pong";

export async function createGame(userID, mode) {
  const response = await fetch(
    `${gatewayEndpoint}/create-game/${userID}/${mode}/`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
  if (!response.ok) {
		throw new Error(`${response.status}`);
	}

	const responseData = await response.json();
	if (responseData !== null) {
		console.log('USER LOG: CREATE NEW GAME ID SUCCESSFUL');
		return responseData;
	} else {
		throw new Error('No response from server');
	}
}

export default async function createWebSocketConnection(gameId = null) {
  const currentUrl = window.location.href;

  var mode = currentUrl.split("/")[3];
  // if (!gameId) {
  //   console.log(`MODE: ${mode}, USER ID: ${userID}`);
  // }

  console.log("MODE", mode);
  switch (mode) {
    case "local-twoplayer":
      mode = "LOCAL_TWO_PLAYERS";
      break;
    case "local-ia":
      mode = "LOCAL_VS_IA";
      break;
    case "remote-twoplayer":
      mode = "REMOTE";
      break;
    case "tournament":
      mode = "TOURNAMENT";
      break;
    default:
      console.log("Invalid mode");
  }

  let gameData;

  if (!gameId) {
    try {
      gameData = await createGame(userID, mode);
    }
    catch (e) {
      console.error(`USER LOG: ${e.message}`);
      return ;
    }
    history.pushState({}, "", `${currentUrl}/${gameData.game_id}`);
    console.log("Location", window.location.href);
    const socket = new WebSocket(
      `ws://localhost:9000/ws/pong/${gameData.game_id}`
    );
    return socket;
  } else {
    let url = window.location.href.split("/");
    console.log(url);
    if (url.length > 4) {
      // Get the old gameId from the URL
      let oldGameId = url[url.length - 1];
      // Check if the new gameId is different from the old one
      if (oldGameId !== gameId) {
        // Replace the old gameId with the new one
        url[url.length - 1] = gameId;
        // Join the URL segments back together
        let newUrl = url.join("/");
        history.pushState({}, "", newUrl);
        console.log("Location Join Game", newUrl);
        const socket = new WebSocket(`ws://localhost:9000/ws/pong/${gameId}`);
        return socket;
      } else {
        console.log(
          "The new gameId is the same as the old one. No need to establish a new WebSocket connection."
        );
        return null;
      }
    } else {
      // Append the new gameId to the URL
      url.push(gameId);
      // Join the URL segments back together
      let newUrl = url.join("/");
      history.pushState({}, "", newUrl);
      console.log("Location Join Game", newUrl);
      const socket = new WebSocket(`ws://localhost:9000/ws/pong/${gameId}`);
      return socket;
    }
  }
}
