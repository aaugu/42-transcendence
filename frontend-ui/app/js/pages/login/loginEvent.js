import { loginButton } from "./loginButton.js"

export async function loginEvent(e) {
	if (e.target.id === "login-submit") {
		console.log("button click: login-submit");
		loginButton();
	}
}