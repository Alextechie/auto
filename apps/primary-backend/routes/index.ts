import express from "express"
import { userRouter } from "./user/userRoutes";
const router = express.Router();

router.use("/api/v1/user", userRouter)
// router.use("/api/v1/zaps", zapRoutes)


export const routes = router