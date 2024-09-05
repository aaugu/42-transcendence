export async function errormsg(msg, id) {
    const errorCont = document.getElementById(id);

    errorCont.classList.remove('hidden');
    errorCont.textContent = msg;
    setTimeout(() => {
        errorCont.classList.add('hidden');
    }, 3000);
}
