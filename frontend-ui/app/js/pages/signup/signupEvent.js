import { signupButton } from "./signupButton.js"

export async function signupEvent(e) {
	if (e.target.id === "signup-submit") {
		console.log("button click: signup-submit");
		signupButton();
	}
}
