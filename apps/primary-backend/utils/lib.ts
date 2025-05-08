import bcrypt from "bcrypt";
import { envs } from "./envs";
import jwt from "jsonwebtoken"
import { resolve } from "bun";
import type { Request, Response } from "express";

const {SALT_ROUNDS, SECRET} = envs

export async function hash(password:string): Promise<string>{
    return await bcrypt.hash(password, Number(SALT_ROUNDS))
};

export async function compare(hashedPassword: string, password: string): Promise<boolean>{
    return await bcrypt.compare(hashedPassword, password)
};


export function generateToken(payload: object, duration: number): string{
    return jwt.sign(payload, String(SECRET), {expiresIn: duration})
};


export function verifyToken(token: string) {
    try{
        return jwt.verify(token, String(SECRET))
    } catch(err){
        return null
    }
}


export function decodeToken(token: string): null | jwt.JwtPayload | string{
    return jwt.decode(token, {complete: true})
}

export const setAuthCookie = (res: Response, token: string, urlPath: string) => {
    res.cookie('auth_token', token, {
        httpOnly: false,
        secure: true,
        maxAge: 60 * 60 * 1 * 1000,
        path: urlPath
    })
};

export const getAuthCookie = (req: Request, token: string) => {
    return req.cookies?.auth_token || null
}

export const deleteCookie = (res: Response, urlPath: string) => {
    return res.clearCookie('auth_token', {path: urlPath})
}