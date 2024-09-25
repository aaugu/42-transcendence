import { userID } from "../../user/updateProfile.js";

const gatewayEndpoint = "https://localhost:10443/api/pong";

export async function createGame(mode) {
  if (userID === null)
    throw new Error('403');

    const url = `${gatewayEndpoint}/create-game/${userID}/${mode}/`;

  const response = await fetch(url,
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
	}
}

export async function createTournamentGame(player1_id, player2_id) {
  const url = `${gatewayEndpoint}/create-game-tournament/${player1_id}/${player2_id}/TOURNAMENT/`;

  const response = await fetch(url,
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
      return "TOURNAMENT";
    default:
      console.log("Invalid mode");
      return null;
  }

}

export async function getGameID () {
  const currentUrl = window.location.href;
  var mode = currentUrl.split("/")[3];

  mode = getGameMode(mode);

  let gameData;

  try {
	gameData = await createGame(mode);
    return gameData.game_id;
  }
  catch (e) {
    if (e.message === "403") {
      throw new Error(`${e.message}`);
    }
    if (e.message === "500" || e.message === "502") {
      throw new Error(`${e.message}`);
    }
    console.error(`USER LOG: ${e.message}`);
    return null;
  }
}