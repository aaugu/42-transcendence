export function newGamePage() {
    const navbarItems = document.getElementsByClassName('nav-item')
    navbarItems[3].children[0].innerText = 'Logout'
    navbarItems[0].children[0].style.display = 'inline'
    navbarItems[1].children[0].style.display = 'inline'
    navbarItems[2].children[0].style.display = 'inline'
    return `
    <div class="text-overlay rainbow-container w-50" id="main-container">
        <h1 class="text-bold display-3">New Game!</h1>
        <br>
        <h2 class="small">Choose your type of game</h2>
        <br>
        <row class="justify-content-center">
            <button type="submit" class="btn btn-dark" id="signin">Two players</button>
            <button type="submit" class="btn btn-light" id="signup">Tournament</button>
        </row> 
    </div>
    `;
}
