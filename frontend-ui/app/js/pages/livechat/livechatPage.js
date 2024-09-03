import { all_contacts, get_all_contacts } from "./contacts.js";
import { userID } from "../user/updateProfile.js";
import { defaultAvatar } from "../user/avatar.js";

export async function livechatPage() {
    const nickname = localStorage.getItem('nickname');
    // var all_users = {};
    // try {
    //     all_users = await getUsers();
    // } catch (e) {
    //     console.error("USER LOG: ", e.message);
    // }
    var html_contacts = `<li class="list-group-item" style="background-color: #A9C1FF;">
                            <span data-convid="1">Placeholder contact</span>
                        </li>`;

    await get_all_contacts();
    const contacts = Object.values(all_contacts);
    var contact_name;
    contacts.forEach(contact => {
        if (contact.user_1 === userID)
            contact_name = contact.user_2;
        else
            contact_name = contact.user_1;
        html_contacts += `
            <li class="list-group-item" style="background-color: #A9C1FF;">
                <span data-convid=${contact.id}>${contact_name}</span>
            </li>`;
    });

    return `
    <div class="content-box d-flex">
        <div id="livechat" class="row m-2 rounded-end rounded-3" style="min-height: 500px;">
            <div id="contact-list" class="col-lg-4 d-flex flex-column justify-content-start clearfix">
                <div id="livechat-menu" class="w-100 rounded-end rounded-3 mt-2">
                    <div id="user-info w-100">${nickname}</div>
                    <form action="post" id="search-bar" class="w-75 text-small">
                        <input class="form-control" type="search" placeholder="Contacts..." aria-label="Search" style="font-size: 12px;">
                        <button class="btn btn-dark" type="submit" id="chat-search-convo" style="font-size: 12px;">Search</button>
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
                </ul>  
             </div>
        </div>
    </div>
    `;
}