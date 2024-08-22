//JWT
import jwt from "jsonwebtoken";
const { verify } = jwt;

export async function auth(req) {
    try {
        const head = req.headers['authorization'];
        const token = head && head.split(' ')[1]; //gets first space or Bearer TOKEN
        if (token == null || token == undefined) {return false}
        verify(token, process.env.STANDARD_TOKEN, function(err, decoded) {
            if (err) {
                console.log("token missmatch detected");
            }
            else {
                return true;
            }
        })  
    } catch (error) {
        return false;
    }
}

export async function adminAuth(req) {
    try {
        const head = req.headers['authorization'];
        const token = head && head.split(' ')[1]; //gets first space or Bearer TOKEN
        if (token == null || token == undefined) {return false}
        verify(token, process.env.STANDARD_TOKEN, function(err, decoded) {
            if (err) {
                console.log("token missmatch detected");
            }
            if (decoded.access == "admin") {
                console.log(decoded);
                return true;
            }
        })  
    } catch (error) {
        return false;
    }
}