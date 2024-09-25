import { error500 } from "../errorpage/error500.js";
import { getUserInfo } from "../user/getUserInfo.js"
import { updateFriendList } from "./friends.js"

export async function publicProfilePage() {
    var username = "Guest";
    var nickname = "Guest-nickname";
    var email = "Guest-email";
    var avatar = "images/default_avatar.png";
    var friends_html = '';

    const user_id = localStorage.getItem('ctc_id');

    try {
        const userinfo = await getUserInfo(user_id);
        username = userinfo.username;
        nickname = userinfo.nickname;
        email = userinfo.email;
        avatar = userinfo.avatar;

        friends_html = await updateFriendList(user_id);

        localStorage.removeItem('ctc_id');
    }
    catch (e) {
        if (e.message == "502")
            return error500();
        console.log("USER LOG: ", e.message);
    }

    return `
    <h2 class="text-bold display-6"></h2>
    <div class="two-column-container">
        <div class="column-left">
            <div id="user-management" class="content-box clearfix">
                <h5 class="m-2">User details</h5>
                <div class="profile-details">
                    <div class="usermanagement-item centered">
                        <img id="profile-avatar" src="${avatar}" alt="User Avatar" class="avatar-img">
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-username">${username}</p>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-nickname">${nickname}</p>
                    </div>
                    <div class="usermanagement-item">
                        <p id="profile-email">${email}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="column-right">
            <div id="personal-stats" class="content-box">
                <h5 class="m-2">Match history</h5>
                <div class="profile-details centered">
                    <p>Total wins: 3</p>
                    <p>Total losses: 2</p>
                </div>
                <ul class="list-group custom-scrollbar m-2 flex-grow-1">
                    <li class="list-group-item">
                        <span>Date</span>
                        <span>Opponent</span>
                        <span>WON/LOST</span>
                    </li>
                    <li class="list-group-item">
                        <span>Date</span>
                        <span>Opponent</span>
                        <span>WON/LOST</span>
                    </li>
                </ul>
            </div>
            <div class="content-box">
                <h5 class="m-2">Friends</h5>
                <ul id="friend-list" class="list-group d-flex custom-scrollbar flex-grow-1 w-100 m-2">
                 ${friends_html}
                </ul>
            </div>
        </div>
    </div>
    `;
}

