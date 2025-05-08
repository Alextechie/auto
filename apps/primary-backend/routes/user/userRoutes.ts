import express from "express"
import { signUpController } from "../../controllers/auth/signup.controller";
import signInController from "../../controllers/auth/signin.controller";
import signOutController from "../../controllers/auth/signout.controller";
const router = express.Router();

router.post("/signup", signUpController)
router.post("/signin", signInController)
router.post("/signout", signOutController)

// router.post("/sign-in", signinController)

export const userRouter = router