export function escapteHTML(unsafeText) {
    const div = document.createElement('div');
    div.textContent = unsafeText;
    return div.innerHTML;
}

export function containsForbiddenCharacters(str) {
	const forbiddenChars = /[^a-zA-Z0-9\s\-\_\.\@]/;
	return forbiddenChars.test(str);
}