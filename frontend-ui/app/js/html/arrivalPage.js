export function arrivalPage() {
    const navbarItems = document.getElementsByClassName('nav-item');
    // navbarItems[0].children[0].style.display = 'none';
    // navbarItems[1].children[0].style.display = 'none';
    // navbarItems[2].children[0].style.display = 'none';
    navbarItems[3].children[0].innerText = 'Login';
    navbarItems[3].children[0].href = "/";

    return `
    <h1 class="text-bold display-3">Welcome!</h1>
    <br>
    <h2 class="small">Sign up to play Pong</h2>
    <br>
    <div class="mb-3">
        <label for="Username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" placeholder="Bob">
    </div>
    <div class="mb-3">
        <label for="Username" class="form-label">Nickname</label>
        <input type="text" class="form-control" id="nickname" placeholder="Pong master">
    </div>
    <div class="mb-3">
        <label for="Username" class="form-label">E-mail</label>
        <input type="text" class="form-control" id="email" placeholder="bob@email.com">
    </div>
    <row class="justify-content-center">
        <button type="submit" class="btn btn-dark" id="signup">Sign up</button>
    </row> 
    `;
}
