import { userID } from "../user/updateProfile.js";
import { all_conversations, get_all_conv } from "./conversations.js";

export async function updateConvList() {
    var html_contacts = '';
    var notifications = '';

	await get_all_conv();
    var contact_nickname, contact_id;
    if (Object.keys(all_conversations).length !== 0) {
        all_conversations.forEach(conv => {
            if (conv.user_1.id === userID) {
                contact_nickname = conv.user_2.nickname;
                contact_id = conv.user_2.id;
            }
            else {
                contact_nickname = conv.user_1.nickname;
                contact_id = conv.user_1.id;
            }
            if (contact_nickname === localStorage.getItem('nickname')) {
                notifications += `
                <li class="list-group-item" style="background-color: #6d96ff;">
                    <span id="notifications" data-convid="${conv.id}" data-ctcid="${contact_id}">Notifications</span>
                </li>`;
            }
            else {
                html_contacts += `
                <li class="list-group-item" style="background-color: #A9C1FF;">
                    <span data-convid="${conv.id}" data-ctcid="${contact_id}">${contact_nickname}</span>
                </li>`;
            }
        });
    }
    const conv_list = document.getElementById('chat-contact-list');
    conv_list.innerHTML = notifications + html_contacts;
}