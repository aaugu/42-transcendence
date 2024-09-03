import { getContacts } from "./getContacts.js";

export var all_contacts = {};

export function reset_all_contacts() {
    all_contacts = {};
}

export async function get_all_contacts() {
    // const response = {
    //     "conversations": [
    //         {
    //             "id": 2,
    //             "user_1": 4,
    //             "user_2": 1
    //         },
    //         {
    //             "id": 11,
    //             "user_1": 1,
    //             "user_2": 3
    //         },
    //         {
    //             "id": 4,
    //             "user_1": 5,
    //             "user_2": 1
    //         },
    //         {
    //             "id": 13,
    //             "user_1": 1,
    //             "user_2": 6
    //         },
    //         {
    //             "id": 1,
    //             "user_1": 7,
    //             "user_2": 1
    //         },
    //         {
    //             "id": 10,
    //             "user_1": 1,
    //             "user_2": 8
    //         }
    //     ]
    // };
	// all_contacts = response.conversations;
	try {
        const response = await getContacts();
		all_contacts = response.conversations;
		console.log("all_contacts: ", all_contacts);
	}
	catch (e) {
		console.error("USER LOG: ", e.message);
		all_contacts = {};
	}
}