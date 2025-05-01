import { prisma } from "@db/prisma"
import { hash } from "../../utils/lib";
// interacts with the database
// types
interface signupProps {
    username: string,
    email: string,
    password: string
}

export async function findUser(email: string){
    return await prisma.user.findUnique({where: {email}})
}

export async function createUser(data: signupProps){
    const {username, email, password} = data;
    return await prisma.user.create({data: {username, email, password}})
}