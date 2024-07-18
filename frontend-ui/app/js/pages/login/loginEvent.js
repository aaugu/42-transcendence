import { loginProcess } from "./loginProcess.js"

export async function loginEvent(e) {
	if (e.target.id === "login-submit") {
		console.log("button click: login-submit");
		loginProcess();
	}
}