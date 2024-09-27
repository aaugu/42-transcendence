import { errormsg } from "../../../dom/errormsg.js";
import { updateProfile } from "../../user/updateProfile.js";
import { urlRoute } from "../../../dom/router.js";

export async function endGame(winner_id, loser_id, game_id) {
  let url = "https://localhost:10443/api/pong/end-game/";

  console.log("winner id in endGame: ", winner_id);
  console.log("loser id in endGame: ", loser_id);
  console.log("game id in endGame: ", game_id);

  let formData = new FormData();
  if (winner_id !== null) {
    formData.append("winner_id", winner_id);
  }
  if (loser_id !== null) {
    formData.append("loser_id", loser_id);
  }
  formData.append("game_id", game_id);

	fetch(url, {
		method: "POST",
		body: formData,
		credentials: "include",
	})
	.then(async (response) => {
		if (!response.ok) {
			if (response.status == 500)
				throw new Error("500");
			else if (response.status == 502)
				throw new Error("502");
			else if (response.status == 403)
				throw new Error("403");
			return response.text().then((text) => {
			throw new Error(
				`Request failed with status ${response.status}: ${text}`
			);
			});
		}
		return response.json();
	})
	.then((data) => {
		console.log("GAME LOG: match successfully ended, ", data);
	})
	.catch((error) => {
		if (error.message === "500" || error.message === "502") {
			errormsg('Game could not be properly finished due to a server error', 'homepage-errormsg');
			urlRoute('/profile');
		}
		else if (error.message === "403") {
			updateProfile(false, null);
			errormsg('You were redirected to the landing page', 'homepage-errormsg');
		}
		console.error("GAME LOG: end match failed, ", error.message);
	});
}
