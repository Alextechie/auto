import bcrypt from "bcrypt";
import { envs } from "./envs";

const {SALT_ROUNDS} = envs

export async function hash(password:string): Promise<string>{
    return await bcrypt.hash(password, Number(SALT_ROUNDS))
}