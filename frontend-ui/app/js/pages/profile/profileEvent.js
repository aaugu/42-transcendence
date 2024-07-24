import { urlRoute } from "../../dom/router.js";

export async function profileEvent(e) {
	switch (e.target.id) {
		case "logout":
			console.log("button click: logout");
			if (sessionStorage.getItem('access_token') !== null)
			{
				sessionStorage.removeItem('access_token');
				console.log('being logged out');
				urlRoute('/');
			}
			else {
				console.log('user was not active');
			}
			break;
		default:
			break;
	}

}