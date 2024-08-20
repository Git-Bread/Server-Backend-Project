//JWT
import jwt from "jsonwebtoken";
const { verify } = jwt;

export function auth(req) {
    try {
        const head = req.headers['authorization'];
        const token = head && head.split(' ')[1]; //gets first space or Bearer TOKEN
        if (token == null || token == undefined) {return false}
        if(verify(token, process.env.STANDARD_TOKEN)) {
            return true;
        }
        return false;   
    } catch (error) {
        return false;
    }
}