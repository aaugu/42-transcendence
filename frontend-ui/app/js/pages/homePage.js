import { isLoggedIn } from "./login/isLoggedIn.js";

export function homePage() {
    const mainCont = document.getElementById("main-content");
    mainCont.style.backgroundColor = "rgba(255, 255, 255, 0)";
    return `
    <h2 class="text-bold display-5">Profile</h2>
    <div class="column">
        <div class="profile-row">
            <div class="profile-column-left">
                <div id="user-management" class="profile-box clearfix">
                    <div class="text-sm m-2">User management</div>
                </div>
                <div id="2fa" class="profile-box clearfix">
                    <div class="text-sm m-2">2fa authentication</div>
                    <button type="text" class="btn btn-success align-items-center m-2" id="2fa-button">Activate</button>
                </div>
            </div>
            <div class="profile-column-right">
                <div id="personal-stats" class="profile-box clearfix" style="height: 200px;">
                    <div class="text-sm m-2">Personal stats</div>
                </div>
                <div id="friends" class="profile-box">
                    <div class="text-sm m-2">Friend list</div>
                </div>
            </div>
        </div>
        <row class="justify-content-center">
            <button type="text" class="btn btn-danger" id="logout">Logout</button>
        </row>
    </div>
    `;
}