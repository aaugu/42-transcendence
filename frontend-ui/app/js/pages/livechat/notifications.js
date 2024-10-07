import { newConvButton } from "./newConv.js";
import { updateConvList } from "./updateConvList.js";
import { get_all_conv, all_conversations } from "./conversations.js";
import { getConvHistory } from "./convHistory.js";
import { userID, updateProfile } from "../user/updateProfile.js";
import { displayChatInterface, displayMessages } from "./messages.js";
import { error500 } from "../errorpage/error500.js"
import { errormsg } from "../../dom/errormsg.js";

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
        document.getElementById("livechat-page").classList.remove("d-none");
    } catch (e) {
        if (e.message === "500" || e.message === "502") {
			document.getElementById('main-content').innerHTML = error500();
        } else if (e.message === "403" || e.message === "401") {
            updateProfile(false, null);
            errormsg('You were redirected to the landing page', 'homepage-errormsg');
		} else {
            errormsg(e.message, "homepage-errormsg");
        }
    }
}

export async function startNotificationsRefresh() {
    if (!notificationsRefreshInterval) {
        notificationsRefreshInterval = setInterval(async () => {
            try {
                const notif = document.getElementById('notifications');
                const response = await getConvHistory(notif.dataset.convid);
                displayChatInterface(notif.dataset.ctcid, "Notifications");
		        displayMessages(response, true);
            } catch (e) {
				if (e.message === "500" || e.message === "502") {
					errormsg("Service temporarily unavailable", "homepage-errormsg");
                } else if (e.message === "403" || e.message === "401") {
                    updateProfile(false, null);
                    errormsg('You were redirected to the landing page', 'homepage-errormsg');
				} else {
                    errormsg(e.message, "homepage-errormsg");
                }
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