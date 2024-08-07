import { urlRoute } from "../../dom/router.js";
import { updateProfile } from "../user/user.js";
import { twoFactorAuthButton } from "../login/twoFactorAuth.js";

export async function profileEvent(e) {
	switch (e.target.id) {
		case "logout":
			updateProfile(null, false, null);
			console.log('User log: LOGOUT');
			urlRoute('/');
			break;
		case "twoFactorAuth-btn":
			console.log('User log: 2FA changed');
			twoFactorAuthButton();
		default:
			break;
	}

}