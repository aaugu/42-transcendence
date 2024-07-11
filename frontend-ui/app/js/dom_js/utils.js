export async function errormsg(msg) {
    const errorCont = document.getElementById('error-msg');

    errorCont.classList.add('text-uppercase');
    errorCont.classList.remove('hidden');
    errorCont.textContent = msg;
    setTimeout(() => {
        errorCont.classList.add('hidden');
        errorCont.classList.remove('text-uppercase');
    }, 5000);
}