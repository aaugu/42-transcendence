import { errormsg } from '../../dom/errormsg.js';
import { passwordValidity} from '../user/password.js';

export function signupFieldsValidity(username, nickname, email, password, repeatPassword)
{
    if (username == '' || nickname == '' || email == '' || password == '' || repeatPassword == '') {
        errormsg("All fields must be filled out");
        return false;
    }
    else if (password !== repeatPassword) {
        errormsg("The passwords don't match");
        return false;
    }
    if (passwordValidity(password) == false) {
        errormsg("Your password must be 8 - 25 characters long and include at least 1 special, 1 uppercase and 1 digit");
		return false;
    }
	return true;
}