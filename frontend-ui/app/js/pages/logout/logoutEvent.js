import { logoutProcess } from "./logoutProcess.js";

export async function logoutEvent(e) {
	console.log("button click: logout");
	logoutProcess();
}