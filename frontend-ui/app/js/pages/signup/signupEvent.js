import { signupProcess } from "./signupProcess.js"

export async function signupEvent(e) {
	switch (e.target.id) {
		case "signup-submit":
			signupProcess();
			break;
		case "uploadAvatar":
			document.getElementById('avatarUpload').style.display = "block";
			break;
		case "defaultAvatar":
			document.getElementById('avatarUpload').style.display = "none";
			break;
		default:
			break;
	}
}
