import { urlRoute } from "../../dom/router.js";
import { updateProfile } from "../user/updateProfile.js";
import { twoFactorAuth, twoFactorAuthModalButton } from "../login/twoFactorAuth.js";
import { editUserInfoButton } from "../user/editUserInfo.js";

export async function profileEvent(e) {
	if (e.target.classList.contains('edit-btn') || e.target.parentElement.classList.contains('edit-btn')) {
        editUserInfoButton(e);
        return;
      }

	switch (e.target.id) {
		case "logout":
			updateProfile(null, false, null);
			console.log('User log: LOGOUT');
			urlRoute('/');
			break;
		// case "twoFactorAuth-btn":
		// 	if (twoFactorAuth === false) {
		// 		const sendCode = await sendTwoFactorAuthCode();
		// 		console.log("sendCode: ", sendCode);
		// 		if (sendCode.success == true) {
		// 			console.log('User log: 2FA code send success');
		// 		}
		// 		else {
		// 			console.log('User log: 2FA code send failure');
		// 		}
		// 	}
		case "confirm-2fa-activation":
		case "confirm-2fa-deactivation":
			console.log('User log: 2FA change');
			twoFactorAuthModalButton();
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