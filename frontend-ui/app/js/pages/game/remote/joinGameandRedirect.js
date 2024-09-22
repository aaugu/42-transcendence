import { userID } from "../../user/updateProfile.js";
import { urlRoute } from "../../../dom/router.js";
import { errormsg } from "../../../dom/errormsg.js";

export async function joinGameandRedirect(gameId, senderId) {
	try {
		if (senderId !== userID) {
			const joinGameEndpoint = "https://localhost:10443/api/pong/join-game";
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
		if (e.message === "500") {
			errormsg("Service temporarily unavailable", "livechat-conversation-error");
		}
		console.error("JOIN GAME ERROR:", error);
	  }
}