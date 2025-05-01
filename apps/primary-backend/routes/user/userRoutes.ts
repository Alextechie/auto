import express from "express"
import { userController } from "../../controllers/auth/signup.controller";
const router = express.Router();

router.post("/signup", userController)

// router.post("/sign-in", signinController)

export const userRouter = router