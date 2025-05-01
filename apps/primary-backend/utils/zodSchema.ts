import {z} from "zod";


export const signupSchema = z.object({
    username: z.string().min(8, "Username cannot be less than 8 characters"),
    email: z.string().email(),
    password: z.string()
})