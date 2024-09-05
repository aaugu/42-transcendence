import { all_conversations, get_all_conv } from "./conversations.js";
import { userID } from "../user/updateProfile.js";
import { defaultAvatar } from "../user/avatar.js";

export async function livechatPage() {
    var html_contacts = '';

    await get_all_conv();
    var contact_nickname;
    all_conversations.forEach(contact => {
        if (contact.user_1.id === userID) {
            contact_nickname = contact.user_2.nickname;
        }
        else {
            contact_nickname = contact.user_1.nickname;
        }
        html_contacts += `
            <li class="list-group-item" style="background-color: #A9C1FF;">
                <span data-convid="${contact.id}">${contact_nickname}</span>
            </li>`;
    });

    return `
    <div class="content-box d-flex">
        <div id="livechat" class="row m-2 rounded-end rounded-3" style="min-height: 75%;">
            <div class="col-lg-4 d-flex flex-column">
                <div id="livechat-menu" class="w-100 rounded-end rounded-3">
                    <div class="input-group m-2 justify-content-center">
                        <input id="chat-search-input" type="text" class="form-control rounded-end" placeholder="New contact" aria-label="Search" style="font-size: 10px;">
                        <div class="input-group-append">
                            <button id="chat-search-btn" class="btn btn-dark" type="button" style="font-size: 10px;">Search</button>
                        </div>
                    </div>
                </div>
                    <ul id="chat-contact-list" class="list-group d-flex custom-scrollbar flex-grow-1 w-100 mt-2">
                        ${html_contacts}
                    </ul>
            </div>
            <div id="conversation" class="col d-lg-flex w-100 flex-column d-none overflow-auto bg-lightgrey">
                <div id="chat-welcome">
                    <div class="h2 text-center mb-5 mt-4">Welcome to Live Chat</div>
                    <div class="h6 text-center">Select a contact to start a conversation</div>
                </div>
                <ul id="chat-msgs"class="row list-unstyled custom-scrollbar flex-grow-1 text-white
                        w-100 mb-2"></ul>
                <div class="d-flex align-items-center">
                    <div id="chat-div-textarea" class="flex-grow-1 me-2 hidden">
                        <div data-mdb-input-init class="form-outline form-white">
                            <textarea class="form-control" id="chat-textarea"></textarea>
                            <label class="form-label" for="textArea"></label>
                        </div>
                    </div>
                    <button id="chat-send" type="button" class="btn btn-light btn-sm btn-rounded hidden">Send</button>
                </div>
             </div>
        </div>
    </div>
    `;
}