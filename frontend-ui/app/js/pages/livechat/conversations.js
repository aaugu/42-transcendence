import { getConversations } from "./getConversations.js";

export var all_conversations = {};

export function reset_all_conv() {
    all_conversations = {};
}

export async function get_all_conv() {
	try {
        const response = await getConversations();
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
				console.error(`USER LOG: User details not found for conversation ID: ${conversation.id}`);
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
		console.log("all_conversations: ", all_conversations);
	}
	catch (e) {
		console.error("USER LOG: ", e.message);
		all_conversations = {};
	}
}