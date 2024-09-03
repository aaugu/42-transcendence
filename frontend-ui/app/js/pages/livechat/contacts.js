import { getContacts } from "./getContacts.js";

export var all_contacts = {};

export function reset_all_contacts() {
    all_contacts = {};
}

export async function get_all_contacts() {
	try {
        const response = await getContacts();
		const user_names = response.users;
		all_contacts = response.conversations;
		console.log("all_contacts: ", all_contacts);
	}
	catch (e) {
		console.error("USER LOG: ", e.message);
		all_contacts = {};
	}
}