export function signupPage() {
    return `
    <div class="profile-box">
        <h1 class="text-bold display-5 m-2">Sign up here</h1>
        <br>
        <div class="text-start m-2 clearfix">
            <label class="form-label" for="username">Username</label>
            <input type="text" class="form-control" id="username" placeholder="Bob">
            <label class="form-label" for="nickname">Nickname</label>
            <input type="text" class="form-control" id="nickname" placeholder="Pong master">
            <label class="form-label" for="email">E-mail</label>
            <input type="email" class="form-control" id="email" placeholder="bob@email.com">
            <label class="form-label" for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="***">
            <label class="form-label" for="repeat-password">Repeat password</label>
            <input type="password" class="form-control" id="repeat-password" placeholder="***">
        </div>
        <row class="justify-content-center">
            <button type="submit" class="btn btn-dark" id="signup-submit">Sign up</button>
        </row>
    </div>
    `;
}
