import { errormsg } from "../../dom/errormsg.js";
import { userID, updateProfile } from "../user/updateProfile.js";
import { error500 } from "../errorpage/error500.js";

export var all_conversations = [];

export function reset_all_conv() {
    all_conversations = [];
}

async function allConversations() {
	if (userID === null) {
		throw new Error('403');
	}

	const response = await fetch('https://' + window.location.host + '/api/livechat/' + userID + '/conversations/', {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		credentials: 'include'
	});
	try {
        if (!response.ok) {
            const responseData = await response.json();
            if (responseData.errors)
                throw new Error(`${responseData.errors}`);
            throw new Error(`${responseData.status}`);
        } else {
            const responseData = await response.json();
            if (responseData !== null) {
                return responseData;
            }
        }
    } catch (e) {
        throw new Error(`${response.status}`);
    }
}

export async function get_all_conv() {
	try {
        const response = await allConversations();
		const userLookup = response.users.reduce((acc, user) => {
			acc[user.id] = {
				nickname: user.nickname,
				avatar: user.avatar
			};
			return acc;
		}, {});

		const conversationsWithUserDetails = response.conversations.map(conversation => {
			const user1Details = userLookup[conversation.user_1];
    		const user2Details = userLookup[conversation.user_2];
			if (!user1Details || !user2Details) {
				return null;
			}
			return {
				id: conversation.id,
				user_1: {
					id: conversation.user_1,
					nickname: user1Details.nickname,
					avatar: user1Details.avatar
				},
				user_2: {
					id: conversation.user_2,
					nickname: user2Details.nickname,
					avatar: user2Details.avatar
				}
			};
		}).filter(conversation => conversation !== null);
		all_conversations = conversationsWithUserDetails;
	}
	catch (e) {
		all_conversations = [];
		if (e.message === "403" || e.message === "401") {
            updateProfile(false, null);
			errormsg('You were redirected to the landing page', 'homepage-errormsg');
        }
		else if (e.message === "500" || e.message === "502") {
			document.getElementById('main-content').innerHTML = error500();
		} else {
			errormsg(e.message, 'homepage-errormsg');
		}

	}
}