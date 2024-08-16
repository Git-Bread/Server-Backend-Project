//registration
export async function register(obj){
    console.log(obj.body);
    let val = await validate(obj, 2)
    if(val != "") {
        return val;
    }

    //new schema object
    let newUser = new login({
        username: obj.body.username,
        password: obj.body.password,
        creationDate: new Date(),
        name: obj.body.name,
        email: obj.body.email
    });
    newUser.save();
    return
}