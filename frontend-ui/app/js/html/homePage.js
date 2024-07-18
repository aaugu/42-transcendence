export function homePage() {
    return `
    <h1 class="text-bold display-5">Come play pong</h1>
    <br>
    <row class="justify-content-center mt-5">
        <button type="submit" class="btn btn-light" id="login" href="/login">Log in</button>
        <button type="submit" class="btn btn-dark" id="signup" href="/signup">Sign up</button>
    </row> 
    `;
}