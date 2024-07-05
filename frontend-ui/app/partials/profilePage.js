export function profilePage() {
    const navbarItems = document.getElementsByClassName('nav-item')
    navbarItems[3].children[0].innerText = 'Logout'
    navbarItems[0].children[0].style.display = 'inline'
    navbarItems[1].children[0].style.display = 'inline'
    navbarItems[2].children[0].style.display = 'inline'
    return `
    <div class="text-overlay rainbow-container w-50" id="main-container">
        <h1 class="text-bold display-3">Profile!</h1>
        <br>
        <h2 class="small">Some information about yourself</h2>
    </div>
    `;
}