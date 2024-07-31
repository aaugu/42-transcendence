import { urlRoute } from "../../dom/router.js";
import { updateProfile } from "../user/user.js";

export async function profileEvent(e) {
	switch (e.target.id) {
		case "logout":
			updateProfile(localStorage.getItem('username'), false, null);
				console.log('LOGOUT');
				urlRoute('/');
			break;
		default:
			break;
	}

}