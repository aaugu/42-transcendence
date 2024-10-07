import { urlRoute } from "../../dom/router.js";
import { updateProfile } from "../user/updateProfile.js";
import { twoFactorAuthProfileButton } from "../login/twoFactorAuth.js";
import { editUserInfoModal } from "../user/editUserInfo.js";
import { addFriend, deleteFriend, updateFriendList } from "./friends.js";
import { errormsg } from "../../dom/errormsg.js";
import { escapeHTML } from "../../dom/preventXSS.js";

export async function profileEvent(e) {
	if (e.target.classList.contains('edit-btn') || e.target.parentElement.classList.contains('edit-btn')) {
        editUserInfoModal(e);
        return;
      }

	switch (e.target.id) {
		case "logout":
			updateProfile(false, null);
			urlRoute('/');
			break;
		case "confirm-2fa-activation":
			twoFactorAuthProfileButton(false);
			break;
		case "confirm-2fa-deactivation":
			twoFactorAuthProfileButton(true);
			break;
		case "add-friend-btn":
			try {
				var friend_nickname = document.getElementById('friend-input').value;
				friend_nickname = escapeHTML(friend_nickname);
				document.getElementById('friend-input').value = '';
				await addFriend(friend_nickname);
				document.getElementById('friend-input').value = '';
				const friendList = document.getElementById('friend-list');
				const friends_html = await updateFriendList();
				friendList.innerHTML = friends_html;
			} catch (e) {
				if (e.message === "502") {
					errormsg("Service temporarily unavailable", "friendlist-errormsg");
				} else {
					errormsg(e.message, 'friendlist-errormsg');
				}
			}
			break;
		case "unfriend-btn":
			try {
				const friend_id = e.target.dataset.friendid;
				await deleteFriend(friend_id);
				const friendList = document.getElementById('friend-list');
				const friends_html = await updateFriendList();
				friendList.innerHTML = friends_html;
			}
			catch (e) {
				if (e.message === "502") {
					errormsg("Service temporarily unavailable", "friendlist-errormsg");
				} else {
					errormsg(e.message, "friendlist-errormsg");
				}
			}
			break;
		default:
			break;
	}

}