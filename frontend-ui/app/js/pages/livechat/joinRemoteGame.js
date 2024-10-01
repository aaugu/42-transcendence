import { userID } from "../user/updateProfile.js";
import { urlRoute } from "../../dom/router.js";
import { errormsg } from "../../dom/errormsg.js";
import { getUserInfo } from "../user/getUserInfo.js";

export async function joinGame(gameId) {
	if (userID === null)
		throw new Error("403");
	const joinGameEndpoint = "https://" + window.location.host + "/api/pong/join-game";
	const response = await fetch(`${joinGameEndpoint}/${gameId}/${userID}`, {
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

export async function joinRemoteGame(gameId, senderId, receiverId) {
	try {

			// console.log("userInfo of senderId in joinRemoteGame (player 1): ", userInfo);

			if (senderId != userID) {
				const userInfo = await getUserInfo(senderId);
				localStorage.setItem('left', userInfo.nickname);
				localStorage.setItem('right', localStorage.getItem('nickname'));
			}
			else if (senderId == userID) {
				const userInfo = await getUserInfo(receiverId);
				localStorage.setItem('left', localStorage.getItem('nickname'));
				localStorage.setItem('right', userInfo.nickname);
			}

			const new_url = `/remote-twoplayer/${gameId}`;
			urlRoute(new_url);

		} catch(e) {
			if (e.message == "500" || e.message == "502") {
				errormsg("Service temporarily unavailable", "homepage-errormsg");
			}
			else if (e.message === "403") {
				updateProfile(false, null);
				errormsg('You were redirected to the landing page', 'homepage-errormsg');
			}
		}
}