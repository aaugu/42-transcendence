import { all_conversations, get_all_conv } from "./conversations.js";
import { userID } from "../user/updateProfile.js";
import { defaultAvatar } from "../user/avatar.js";

export async function livechatPage() {
    const nickname = localStorage.getItem('nickname');
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
                <span data-convid=${contact.id}>${contact_nickname}</span>
            </li>`;
    });

    return `
    <div class="content-box d-flex">
        <div id="livechat" class="row m-2 rounded-end rounded-3" style="min-height: 500px;">
            <div id="contact-list" class="col-lg-4 d-flex flex-column justify-content-start clearfix">
                <div id="livechat-menu" class="w-100 rounded-end rounded-3 mt-2">
                    <div id="user-info w-100">${nickname}</div>
                    <form action="post" id="search-bar" class="w-75 text-small">
                        <input id="chat-search-input" class="form-control" type="search" placeholder="contacts..." aria-label="Search">
                        <button class="btn btn-dark" type="submit" id="chat-search-btn">Search</button>
                    </form>
                </div>
                <div id="contact" class="d-flex clearfix mb-2 w-100">
                    <ul class="list-group justify-content-center d-flex overflow-auto w-100 m-2" style="max-height: 500px; min-height: 200px;">
                     ${html_contacts}
                    </ul>
                </div>
            </div>
            <div id="conversation" class="col d-lg-flex w-100 flex-column d-none d-lg-block h-100 overflow-auto bg-lightgrey">
                <div class="h2 text-center mb-5 mt-4">Welcome to Live Chat</div>
                <div class="h6 text-center">Select a contact to start a conversation</div>


                <ul class="row list-unstyled custom-scrollbar text-white w-100 mb-2" style="max-height: 500px; min-height: 300px;">
                    <li class="d-flex mb-4">
                        <img src=${defaultAvatar} alt="avatar"
                        class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="30">
                        <div class="card">
                        <div class="card-body">
                            <p class="mb-0">
                            Hi there 👋
                            </p>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <p class="small mb-0" style="font-size: 7px;">19:25</p>
                        </div>
                        </div>
                    </li>
                    <li class="d-flex mb-4 justify-content-end">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                huhu
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-end">
                                <p class="small mb-0" style="font-size: 7px;">19:25</p>
                            </div>
                        </div>
                        <img src=${defaultAvatar} alt="avatar"
                        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
                    </li>
                    <li class="d-flex mb-4 justify-content-end">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                huhu
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-end">
                                <p class="small mb-0" style="font-size: 7px;">19:25</p>
                            </div>
                        </div>
                        <img src=${defaultAvatar} alt="avatar"
                        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
                    </li>
                    <li class="d-flex mb-4 justify-content-end">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                huhu
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-end">
                                <p class="small mb-0" style="font-size: 7px;">19:25</p>
                            </div>
                        </div>
                        <img src=${defaultAvatar} alt="avatar"
                        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
                    </li>
                    <li class="d-flex mb-4 justify-content-end">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                huhu
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-end">
                                <p class="small mb-0" style="font-size: 7px;">19:25</p>
                            </div>
                        </div>
                        <img src=${defaultAvatar} alt="avatar"
                        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
                    </li>
                    <li class="d-flex mb-4 justify-content-end">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                huhu
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-end">
                                <p class="small mb-0" style="font-size: 7px;">19:25</p>
                            </div>
                        </div>
                        <img src=${defaultAvatar} alt="avatar"
                        class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
                    </li>
                </ul>
               <div class="d-flex align-items-center">
                    <div class="flex-grow-1 me-2">
                        <div data-mdb-input-init class="form-outline form-white">
                            <textarea class="form-control" id="textAreaExample3"></textarea>
                            <label class="form-label" for="textAreaExample3"></label>
                        </div>
                    </div>
                    <button type="button" class="btn btn-light btn-sm btn-rounded">Send</button>
                </div>
             </div>
        </div>
    </div>
    `;
}