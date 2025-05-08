import type { Request, Response } from "express";
import { deleteCookie } from "../../utils/lib";

export default function signOutController(req: Request, res: Response): any{
    deleteCookie(res, "/")
    return res.status(200).json({
        message: "Logout successfully"
    })
};

