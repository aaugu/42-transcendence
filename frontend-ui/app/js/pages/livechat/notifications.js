import { newConvButton } from "./newConv.js";
import { updateConvList } from "./updateConvList.js";
import { get_all_conv, all_conversations } from "./conversations.js";
import { getConvHistory } from "./convHistory.js";
import { userID, updateProfile } from "../user/updateProfile.js";
import { displayChatInterface, displayMessages } from "./messages.js";
import { error500 } from "../errorpage/error500.js"

let notificationsRefreshInterval;
let current_ctc_id;

export async function notifications() {
    var self_already_added = false;

    try {
        await get_all_conv();
        if (all_conversations.length !== 0) {
            all_conversations.forEach(conv => {
                if (conv.user_1.id === conv.user_2.id) {
                    self_already_added = true;
                }
            })};
        if (!self_already_added) {
            document.getElementById('chat-search-input').value = localStorage.getItem('nickname');
            await newConvButton();
        }
        updateConvList(); 
    } catch (e) {
        if (e.message === "500" || e.message === "502") {
			document.getElementById('main-content').innerHTML = error500();
		}
    }
}

export async function startNotificationsRefresh() {
    if (!notificationsRefreshInterval) {
        notificationsRefreshInterval = setInterval(async () => {
            try {
                const notif= document.getElementById('notifications');
                const response = await getConvHistory(notif.dataset.convid);
                displayChatInterface(notif.dataset.ctcid);
		        displayMessages(response);
            } catch (e) {
                console.log("USER LOG: Failed to refresh notifications list:", e.message);
            }
        }, 3000);
    }
}

export function clearNotificationsRefresh() {
    if (notificationsRefreshInterval) {
        clearInterval(notificationsRefreshInterval);
        notificationsRefreshInterval = null;
    }
}

export function setCurrentContactID(ctc_id) {
    current_ctc_id = parseInt(ctc_id);
    if (current_ctc_id === userID) {
        startNotificationsRefresh();
    }
    else if (current_ctc_id !== userID && notificationsRefreshInterval) {
        clearNotificationsRefresh();
    }
}