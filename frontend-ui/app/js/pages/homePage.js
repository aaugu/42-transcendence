export function homePage() {
    document.getElementById('nav-profile-elements').classList.add('hidden');
	document.getElementById('logo').href = "/";
    return `
    <div class="content-box">
        <h1 class="text-bold display-5 m-2">Come play pong</h1>
        <br>
        <row class="justify-content-center m-2">
            <a type="submit" class="btn btn-light" id="login" href="/login">Log in</a>
            <a type="submit" class="btn btn-dark" id="signup" href="/signup">Sign up</a>
        </row>
    </div>
    `;
}