import { userID } from "../user/updateProfile.js";
import { all_conversations, get_all_conv } from "./conversations.js";

export async function updateConvList() {
    var html_contacts = '';

	await get_all_conv();
    var contact_nickname, contact_id;
    if (Object.keys(all_conversations).length !== 0) {
        all_conversations.forEach(contact => {
            if (contact.user_1.id === userID) {
                contact_nickname = contact.user_2.nickname;
                contact_id = contact.user_2.id;
            }
            else {
                contact_nickname = contact.user_1.nickname;
                contact_id = contact.user_1.id;
            }
            html_contacts += `
                <li class="list-group-item" style="background-color: #A9C1FF;">
                    <span data-convid="${contact.id}" data-ctcid="${contact_id}">${contact_nickname}</span>
                </li>`;
        });
    }
    const conv_list = document.getElementById('chat-contact-list');
    conv_list.innerHTML = html_contacts;
}