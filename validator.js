//comprehensive validation
export default async function validate(obj, mode, login) {
    //holds all errors for comprehensive output
    let errors = [];

    //checks for standard empty
    if (!obj.body.username) {
        errors.push("No username")
    }
    if (!obj.body.password) {
        errors.push("No password")
    }

    let logins = await login.find();

    //diffrent validation modes for login/register, more efficient with an if but this is more expandable, and a login system will be really easy to re-use for future projects
    switch (mode) {
        case 1:
            //checks if user exists
            let match = false;
            for (let index = 0; index < logins.length; index++) {
                if (obj.body.username == logins[index].username) {
                    match = true;
                }
            }
            if (!match) {
                errors.push("invalid username")
            }
            if (errors[0] != "") {
                return errors;   
            }
        
        case 2:
            //compares usernames to check for duplicate, sort of bad praxis due to the whole "you know an account exists"
            for (let index = 0; index < logins.length; index++) {
                if (obj.body.username == logins[index].username) {
                    errors.push("Invalid username, that email already has an account")
                }  
            }
 
            //some lenght and "exist" checks
            if (!obj.body.name) {
                errors.push("No name")
            }
            if (!obj.body.username) {
                errors.push("No username")
            }
            if (!obj.body.number) {
                errors.push("No number")
            }
            //regex for email format, makes sure it is two parts and an @ aswell as an 2-4 ending such as .com
            let regex = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;
            let valid = regex.test(obj.body.email);
            if (!valid) {
                errors.push("Invalid username, use your email")
            }
                        
            //makes sure password contains a capital letter, one numbers and atleast 6 symbols
            regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            valid = regex.test(obj.body.password)
            if (!valid) {
                errors.push("password invalid, it needs to be atleast six symbols, one uppercase letter, and two numbers")
            }

            //checks if phone number is real
            regex = /^[0-9]{8}$/;
            valid = regex.test(obj.body.number)
            if (!valid) {
                errors.push("phone number invalid")
            }

            //sends all the errors back
            if (errors[0] != "") {
                return errors;   
            }
        default:
            break;
    }
    return false
}