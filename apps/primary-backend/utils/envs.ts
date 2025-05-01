import dotenv from "dotenv"

dotenv.config();

export const envs = {
    PORT: process.env.PORT,
    SALT_ROUNDS: process.env.SALT_ROUNDS
}