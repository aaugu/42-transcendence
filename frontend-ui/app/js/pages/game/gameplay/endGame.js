import { errormsg } from "../../../dom/errormsg.js";
import { updateProfile } from "../../user/updateProfile.js";
import { urlRoute } from "../../../dom/router.js";

export async function endGame(winner_id, loser_id, game_id) {
	let url = "https://localhost:10443/api/pong/end-game/";

	console.log("GAME LOG: ending game with winner_id: ", winner_id, " and loser_id: ", loser_id, " and game_id: ", game_id);

	let formData = new FormData();
	if (winner_id !== null) {
		formData.append("winner_id", winner_id);
	}
	if (loser_id !== null) {
		formData.append("loser_id", loser_id);
	}
	formData.append("game_id", game_id);

	const response = await fetch(url, {
		method: "POST",
		body: formData,
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error(`${response.status}`);
	}
}
