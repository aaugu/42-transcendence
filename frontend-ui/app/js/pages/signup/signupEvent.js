import { signupProcess } from "./signupProcess.js"

export async function signupEvent(e) {
	switch (e.target.id) {
		case "signup-submit":
			signupProcess();
			break;
		case "uploadAvatar":
			document.getElementById('avatar-upload-file').style.display = "block";
			break;
		case "defaultAvatar":
			document.getElementById('avatar-upload-file').style.display = "none";
			break;
		default:
			break;
	}
}
