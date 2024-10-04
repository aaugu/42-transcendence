export function encodeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

export function containsForbiddenCharacters(str) {
	const forbiddenChars = /[^a-zA-Z0-9\s\-\_\.\@]/;
	return forbiddenChars.test(str);
}