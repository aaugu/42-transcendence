import { isLoggedIn } from "./login/isLoggedIn.js";

export function homePage() {
    return `
    <h2 class="text-bold display-5">Profile</h1>
    <div class="column">
        <div class="profile-row">
            <div class="profile-column-left">
                <div id="user-management" class="profile-box  clearfix">user management</div>
                <div id="2fa" class="profile-box clearfix">2fa authentication
                    <button type="text" class="btn btn-success" id="2fa-button">Activate</button>
                </div>
            </div>
            <div class="profile-column-right">
                <div id="personal-stats" class="profile-box clearfix" style="height: 200px;">stats</div>
                <div id="friends" class="profile-box">friends</div>
            </div>
        </div>
        <row class="justify-content-center">
            <button type="text" class="btn btn-danger" id="logout">Logout</button>
        </row>
    </div>
    `;
}