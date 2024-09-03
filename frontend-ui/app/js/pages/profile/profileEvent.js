import { urlRoute } from "../../dom/router.js";
import { updateProfile } from "../user/updateProfile.js";
import { twoFactorAuthProfileButton } from "../login/twoFactorAuth.js";
import { editUserInfoModal } from "../user/editUserInfo.js";

export async function profileEvent(e) {
	if (e.target.classList.contains('edit-btn') || e.target.parentElement.classList.contains('edit-btn')) {
        editUserInfoModal(e);
        return;
      }

	switch (e.target.id) {
		case "logout":
			updateProfile(false, null);
			console.log('USER LOG: LOGOUT');
			urlRoute('/');
			break;
		case "confirm-2fa-activation":
			twoFactorAuthProfileButton(false);
			break;
		case "confirm-2fa-deactivation":
			twoFactorAuthProfileButton(true);
			break;
		// case "edit-save":
		// 	const editButton = e.target.closest('.edit-btn');
		// 	const currentField = editButton.dataset.field;
		// 	const editInput = document.getElementById('edit-input');
		// 	editModal.hide();
		// 	//handle POST request to update user info
		// 	break;
		default:
			break;
	}

}