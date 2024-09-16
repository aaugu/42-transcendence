import { userID } from "../../user/updateProfile.js";
import { urlRoute } from "../../../dom/router.js";

export async function joinGameandRedirect() {
	// gameId = document.getElementById("game-id-input").value;
	// senderId = userID;
	try {
		if (senderId !== userID) {
			const joinGameEndpoint = "https://localhost:10444/pong/join-game";
			const response = await fetch(`${joinGameEndpoint}/${gameId}/${userID}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				},
				credentials: "include"
			});

			if (!response.ok) {
			throw new Error(`Failed to join game. Status: ${response.status}`);
			}
		}

		// const data = await response.json();
		// console.log("JOIN GAME RESPONSE:", data);

		const new_url = `/remote-twoplayer/${gameId}`;
		urlRoute(new_url);

	  } catch(error) {
		console.error("JOIN GAME ERROR:", error);
	  }
}