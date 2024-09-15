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

export async function getGameID () {
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
    case "local-ai":
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

  try {
    gameData = await createGame(userID, mode);
    return gameData.game_id;
  }
  catch (e) {
    console.error(`USER LOG: ${e.message}`);
    return null;
  }
}