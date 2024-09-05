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
                <button id="block-btn" class="btn btn-outline-danger btn-sm m-0 p-1" title="Block user" type="button" data-nickname="${contact_nickname}">
                    <i class="bi text-danger bi-ban m-0 p-0"></i>
                </button>
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
            <div id="conversation" class="col d-lg-flex w-100 flex-column d-none overflow-auto">
                <div id="chat-welcome">
                    <div class="h2 text-center mb-5 mt-4">Welcome to Live Chat</div>
                    <div class="h6 text-center">Select a contact to start a conversation</div>
                </div>
                <ul id="chat-msgs"class="row list-unstyled custom-scrollbar flex-grow-1 text-white
                        w-100 mb-2"></ul>
                <div class="d-flex align-items-center">
                    <div id="chat-div-textarea" class="flex-grow-1 me-2 hidden">
                        <div data-mdb-input-init class="form-outline form-white">
                            <textarea class="form-control" id="chat-textarea" rows="1" style="resize: none; font-size=10px;"></textarea>
                            <label class="form-label" for="textArea"></label>
                        </div>
                    </div>
                    <button id="chat-send" type="button" class="btn btn-light btn-sm btn-rounded me-2 hidden">Send</button>
                    <button id="chat-play-pong" type="button" class="btn btn-dark btn-sm btn-rounded hidden">
                        <i class="bi bi-controller text-white"></i>
                    </button>
                </div>
             </div>
        </div>
    </div>
    `;
}