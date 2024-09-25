export async function endGame(winner_id, loser_id, game_id) {
	let url = "https://localhost:10443/api/pong/end-game/";

	let formData = new FormData();
	formData.append("winner_id", winner_id);
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
		console.error("Error during fetch:", error);
	});
}