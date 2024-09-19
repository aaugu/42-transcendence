import { newConvButton } from "./newConv.js";
import { updateConvList } from "./updateConvList.js";
import { get_all_conv, all_conversations } from "./conversations.js";

export async function notifications() {
    var self_already_added = false;

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
}