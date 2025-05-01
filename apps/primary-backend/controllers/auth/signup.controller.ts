import type { Request, Response } from "express";
import { signupSchema } from "../../utils/zodSchema";
import { findUser, createUser } from "../../models/auth/userModel";
import { hash } from "../../utils/lib";

export const userController = async (req: Request, res: Response): Promise<any> => {
    // request the data
    const data = req.body;

    // do input validation
    const parsedInputs = signupSchema.safeParse(data);

    if(!parsedInputs.success) {
        return res.json({
            message: "Invalid inputs",
            error: parsedInputs.error.format
        })
    }

    const {username, email, password} = parsedInputs.data

    try{
        const checkIfExists = await findUser(email);
        if(checkIfExists){
            return res.status(409).json({
                message: "User already exists"
            })
        }

        // hash the password
        const hashedPassword = await hash(password);

        // call the create user function
        const user = await createUser({username, email, password: hashedPassword});

        return res.status(201).json({
            message: "User created successfully",
            info: user
        })
    }catch(err){
        return res.status(500).json({
            message: "Error adding user to the db",
            msg: "Internal server error",
            error: err
        })
    }

}