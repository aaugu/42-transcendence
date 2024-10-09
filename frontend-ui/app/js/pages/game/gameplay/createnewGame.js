import { userID } from "../../user/updateProfile.js";

const gatewayEndpoint = "https://" + window.location.host + "/api/pong";

export async function createGame(mode, id = 0) {
  if (userID === null)
    throw new Error('401');

    const url = `${gatewayEndpoint}/create-game/${userID}/${mode}/${id}/`;

  const response = await fetch(url,
  {
    method: 'POST',
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
		return responseData;
	}
}

export async function createTournamentGame(player1_id, player2_id, mode) {
	if (player1_id === null)
		throw new Error('401');

	const url = `${gatewayEndpoint}/create-game-tournament/${player1_id}/${player2_id}/${mode}/`;

	const response = await fetch(url,
	{
  method: 'POST',
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
		return responseData;
	}
}

export async function createGameRemote(player1_id, player2_id, mode) {
	const url = `${gatewayEndpoint}/create-game-remote/${player1_id}/${player2_id}/${mode}/`;

	const response = await fetch(url,
	{
    method: 'POST',
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
			return null;
  }

}

export async function getGameID (game_mode = null) {
	const currentUrl = window.location.href;
	var mode = game_mode || currentUrl.split("/")[3];
	let gameData;

	mode = getGameMode(mode);
	if (mode === null) {
		throw new Error("404");
	}
	gameData = await createGame(mode);
	if (gameData === null) {
		throw new Error("500");
	}
	return gameData.game_id;
}