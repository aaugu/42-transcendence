export function error404Page() {
    const navbarItems = document.getElementsByClassName('nav-item')
    navbarItems[3].children[0].innerText = 'Logout'
    navbarItems[0].children[0].style.display = 'none'
    navbarItems[1].children[0].style.display = 'none'
    navbarItems[2].children[0].style.display = 'none'
    return `
    <h1 class="text-bold display-3">404 Not found</h1>
    <br>
    <h2 class="small">Sorry!</h2>
    `;
}