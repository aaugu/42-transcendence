import { userID } from "../../user/updateProfile.js";
import { urlRoute } from "../../../dom/router.js";
import { errormsg } from "../../../dom/errormsg.js";
import { getUserInfo } from "../../user/getUserInfo.js";

export async function joinGame(gameId, id = null) {
	console.log("called join game");
	const user_id = id || userID;
	const joinGameEndpoint = "https://localhost:10443/api/pong/join-game";
	const response = await fetch(`${joinGameEndpoint}/${gameId}/${user_id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		},
		credentials: "include"
	});

	if (!response.ok) {
		throw new Error(`${response.status}`);
	}
}

export async function joinGameandRedirect(gameId, senderId) {
	try {
			const userInfo = await getUserInfo(senderId);

			console.log("user info: ", userInfo);
			if (userInfo) {
				localStorage.setItem('left', userInfo.nickname);
				localStorage.setItem('right', localStorage.getItem('nickname'));
			}

			await joinGame(gameId);

			const new_url = `/remote-twoplayer/${gameId}`;
			urlRoute(new_url);

		} catch(e) {
			if (e.message == "500" || e.message == "502") {
				errormsg("Service temporarily unavailable", "homepage-errormsg");
			}
		}
}