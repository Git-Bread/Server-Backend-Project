//comprehensive input validation
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
        
        //registration
        case 2:
            //compares numbers to check for duplicate
            for (let index = 0; index < logins.length; index++) {
                if (obj.body.number == logins[index].number) {
                    errors.push("Invalid number, that number is already in use")
                }  
            }

            //compares usernames to check for duplicate
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
            let valid = regex.test(obj.body.username);
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

import { compare } from "bcrypt";
//validates password
export async function loginValidation(obj, login) {
    let uname = obj.body.username;
    let password = obj.body.password;
    let user = await login.find({username: uname});

    //hash compare
    try {
        if (await compare(password, user[0].password)) {
            console.log("Correct password for user: " + uname);
            return true;
        }
        else {
            return false
        }   
    } catch (error) {
        console.log("it broke");
        return false;
    }
}

//simple menuitem validation, not to strict since only admins can edit it, so everything that works is mostly allowed
export async function menuItemValidation(obj) {
    let errors = [];
    if (!obj.body.name) { errors.push("no menuitem name") };
    if (!obj.body.price) { errors.push("no menuitem price")};
    if (!obj.body.description) { errors.push("no menuitem description")};

    if (isNaN(obj.body.price)) {
        errors.push("price is not a number")
    }

    if (errors[0] != "") {
        return errors;
    }
    return false;
}