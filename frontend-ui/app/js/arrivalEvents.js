/*	ARRIVAL PAGE TO SIGN UP OR SIGN IN	*/

// var mainContainer = document.querySelector('#main-container')
// mainContainer.classList.add('w-50')

const navbarItems = document.getElementsByClassName('nav-item')
// const descriptionText = document.getElementById('descriptionText')
// const titleText = document.getElementById('titleText')
// const buttons = document.querySelector('#main-buttons')

arrivalPage()

function arrivalPage () {
	// document.getElementById('first-input-field').style.display = 'none'
	// navbarItems[0].style.display = 'none'
	// navbarItems[1].style.display = 'none'
	// navbarItems[2].style.display = 'none'
	navbarItems[3].children[0].innerText = 'Login'
	titleText.innerText = "Welcome!"
	descriptionText.innerText = "Please sign in or sign up if you do not have an account yet"
	buttons.addEventListener('click', arrivalPageRedirection, 'once')
}

function arrivalPageRedirection(e) {
	if (e.target == buttons.children[0])
	{
		signUpForm()
	}
	else if (e.target == buttons.children[1])
	{
		console.log("sign up")
	}
}

function signUpForm () {
	titleText.innerText = "Sign up"
	descriptionText.innerText = ""
	document.getElementById('first-input-field').style.display = 'inline'
	buttons.children[0].style.display = 'none'
	buttons.children[1].innerText = 'Submit'
	//create two more input fields
}

function signInForm () {
	titleText.innerText = "Sign in"
	descriptionText.innerText = ""
	document.getElementById('first-input-field').style.display = 'inline'
	buttons.children[0].style.display = 'none'
	buttons.children[1].innerText = 'Submit'
	//create two more input fields
}

function twoFactorAuthentication () {
	titleText.innerText = "Sign up"
	descriptionText.innerText = ""
	document.getElementById('first-input-field').style.display = 'inline'
	buttons.children[0].style.display = 'none'
	buttons.children[1].innerText = 'Submit'
	//create two more input fields
}



// console.log(buttons.previousElementSibling)
// buttons.previousElementSibling.style.color = 'green'
// buttons.parentNode.style.backgroundColor = '#f0f6f6'