import { userID, updateProfile } from "../../user/updateProfile.js";
import { errormsg } from "../../../dom/errormsg.js"

const gatewayEndpoint = "https://localhost:10443/api/pong";

export async function createGame(mode, tourn_id = null) {
  if (userID === null)
    throw new Error('403');

  var response;

  // if (tourn_id) {
  //   response = await fetch(
  //     `${gatewayEndpoint}/create-game/${userID}/${mode}/${tourn_id}/`,
  //     {
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include'
  //     });
  // }
  // else {
    response = await fetch(
      `${gatewayEndpoint}/create-game/${userID}/${mode}/`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
  // }
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
    case "tournament-creation":
      return "REMOTE";
    default:
      console.log("Invalid mode");
      return null;
  }

}

export async function getGameID (tourn_id = null) {
  const currentUrl = window.location.href;

  var mode = currentUrl.split("/")[3];

  console.log("MODE", mode);
  mode = getGameMode(mode);

  let gameData;

  try {
    if (tourn_id)
      gameData = await createGame(mode, tourn_id);
    else
      gameData = await createGame(mode);
    return gameData.game_id;
  }
  catch (e) {
    if (e.message === "403") {
      updateProfile(false, null);
      errormsg('You were automatically logged out', 'homepage-errormsg');
    }
    console.error(`USER LOG: ${e.message}`);
    return null;
  }
}