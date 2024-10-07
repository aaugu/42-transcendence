import { userID } from "../user/updateProfile.js";
import { urlRoute } from "../../dom/router.js";
import { errormsg } from "../../dom/errormsg.js";
import { getUserInfo } from "../user/getUserInfo.js";

export async function joinRemoteGame(gameId, senderId, receiverId) {
	try {
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
			else if (e.message === "403" || e.message === "401") {
				updateProfile(false, null);
				errormsg('You were redirected to the landing page', 'homepage-errormsg');
			} else {
				errormsg(e.message, 'homepage-errormsg');
			}
		}
}