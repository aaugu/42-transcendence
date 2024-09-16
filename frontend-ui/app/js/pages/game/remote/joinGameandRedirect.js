import { userID } from "../../user/updateProfile.js";
import { urlRoute } from "../../../dom/router.js";

export async function joinGameandRedirect(gameId, senderId) {
	try {
		console.log("join game and redirect");
		if (senderId !== userID) {
			console.log("needs to join");
			const joinGameEndpoint = "https://localhost:10443/pong/join-game";
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

		const new_url = `/remote-twoplayer/${gameId}`;
		urlRoute(new_url);

	  } catch(error) {
		console.error("JOIN GAME ERROR:", error);
	  }
}