import { error404Page } from "../errorpage/error404Page.js";
import { error500 } from "../errorpage/error500.js";
import { getNicknameUserInfo } from "../user/getUserInfo.js"
import { updateFriendList } from "./friends.js"
import { matchHistoryList, matchWinsLosses } from "./matchHistory.js";
import { updateProfile } from "../user/updateProfile.js"
import { errormsg } from "../../dom/errormsg.js"

export async function publicProfilePage() {
	var nickname = window.location.href.split("/")[4];
	var matches_html = '';
	var match_wins = '';
	var match_losses = '';
	if (nickname === null || nickname === "")
		return error404Page();

    if ( user_id === null )
        throw new Error('401');
    document.getElementById('nav-profile-elements').classList.remove('hidden');
    document.getElementById('logo').href = "/profile";

    try {
        const userinfo = await getNicknameUserInfo(nickname);
        var email = userinfo.email;
        var avatar = userinfo.avatar;
		var user_id = userinfo.id;

        var friends_html = await updateFriendList(user_id);
		matches_html = await matchHistoryList(nickname, user_id);

		const match_wins_losses = matchWinsLosses(nickname);
		match_wins = match_wins_losses.wins;
		match_losses = match_wins_losses.losses;
    }
    catch (e) {
        if (e.message === "404")
            return error404Page();
        else if (e.message === "502")
            return error500();
        else if (e.message === "401" || e.message === "403") {
            updateProfile(false, null);
			errormsg('You were redirected to the landing page', 'homepage-errormsg');
        }
        else {
            errormsg(e.message, 'homepage-errormsg');
        }
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
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Opponent</th>
                            <th scope="col">Mode</th>
                            <th scope="col">Result</th>
                            </tr>
                        </thead>
                        <tbody class="custom-scrollbar">
                            ${matches_html}
                        </tbody>
                    </table>
                </div>
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

