import type { Request, Response } from "express";
import { siginSchema } from "../../utils/zodSchema";
import { findUser } from "../../models/auth/userModel";
import { compare, generateToken, setAuthCookie } from "../../utils/lib";


export default async function signInController(req: Request, res: Response): Promise<any>{
    // get the signin data
    const data = req.body;

    // input validation
    const parsedInputs = siginSchema.safeParse(data);
    if(!parsedInputs.success){
        return res.status(400).json({
            message: "Invalid Inputs",
            error: parsedInputs.error.formErrors
        })
    }
    const {email, password} = parsedInputs.data;
    try{
        // check if a user exists with this email
        const exists = await findUser(email);

        if (!exists){
            return res.status(409).json({
                message: "User does not exist"
            })
        }

        // grab the hashed password from the db
        const hash = exists.password;

        // compare whether the db password matched the hashedpassword
        const matches = await compare(password, hash);

        if(!matches){
            return res.status(409).json({
                message: "Your password does not match"
            })
        }

        // payload to sign the jwt
        const profile = {
            id: exists.id,
            email: exists.id
        }
        const duration = 10 * 60 * 1 * 1000
        // sign a jwt token and put it onto a cookie
        const token = generateToken(profile, duration);

        // pass this token into a cookie
        setAuthCookie(res, token, "/");

        
        return res.status(200).json({
            message: "Logged in successfully",
            email
        })

    } catch(err){
        return res.status(500).json({
            message: "Internal server error",
            error: err
        })
    }
}