import { userID } from "../../user/updateProfile.js";

const gatewayEndpoint = "https://localhost:10443/api/pong";

export async function createGame(mode) {
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

export function getGameMode(mode) {
  switch (mode) {
    case "local-twoplayer":
      return "LOCAL_TWO_PLAYERS";
    case "local-ai":
      return "LOCAL_VS_IA";
    case "remote-twoplayer":
      return "REMOTE";
    case "tournament":
      return "TOURNAMENT";
    default:
      console.log("Invalid mode");
      return null;
  }
  
}

export async function getGameID () {
  const currentUrl = window.location.href;

  var mode = currentUrl.split("/")[3];

  console.log("MODE", mode);
  mode = getGameMode(mode);

  let gameData;

  try {
    gameData = await createGame(mode);
    return gameData.game_id;
  }
  catch (e) {
    console.error(`USER LOG: ${e.message}`);
    return null;
  }
}