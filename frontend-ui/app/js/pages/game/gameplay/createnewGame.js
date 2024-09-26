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
    case "remote-twoplayer":
      return "REMOTE";
    case "tournament-creation":
      return "TOURNAMENT";
	  case "tournament-remote":
		return "TOURNAMENT_REMOTE";
    default:
      console.log("Invalid mode");
      return null;
  }

}

export async function getGameID (game_mode = null) {
	const currentUrl = window.location.href;
	var mode = game_mode || currentUrl.split("/")[3];
	let gameData;

	mode = getGameMode(mode);

	gameData = await createGame(mode);
	if (gameData === null) {
		throw new Error("500");
	}
	return gameData.game_id;
}