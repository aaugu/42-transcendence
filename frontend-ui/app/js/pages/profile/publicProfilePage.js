import { error500 } from "../errorpage/error500.js";
import { getNicknameUserInfo } from "../user/getUserInfo.js"
import { updateFriendList } from "./friends.js"
import { matchHistoryList, matchWinsLosses } from "./matchHistory.js";

export async function publicProfilePage() {
    var username = "Guest";
    var nickname = "Guest-nickname";
    var email = "Guest-email";
    var avatar = "images/default_avatar.png";
	var user_id = "";
    var friends_html = '';
	var matches_html = '';
	var match_wins = '';
	var match_losses = '';

	nickname = window.location.href.split("/")[4];
	if (nickname === null || nickname === "")
		return error500();

    try {
        const userinfo = await getNicknameUserInfo(nickname);
        username = userinfo.username;
        email = userinfo.email;
        avatar = userinfo.avatar;
		user_id = userinfo.id;

        friends_html = await updateFriendList(user_id);
		matches_html = await matchHistoryList(user_id);

		const match_wins_losses = matchWinsLosses(user_id);
		match_wins = match_wins_losses.wins;
		match_losses = match_wins_losses.losses;
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
                    <p>Total wins: ${match_wins}</p>
                    <p>Total losses: ${match_losses}</p>
                </div>
                <ul class="list-group custom-scrollbar m-2 flex-grow-1">
                    ${matches_html}
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

