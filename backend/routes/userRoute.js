import express from "express"
import {changePassword, loginUser,registerUser, userInfo,addUserInfo, updateUserInfo,resetPassword,totalUsers } from "../controllers/usercontroller.js";
import { sendMail, verifyOtp } from "../controllers/mail.js";
import authMiddleware from "../middleware/auth.js";


const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/userdata",userInfo)
userRouter.post("/adduserinfo",addUserInfo)
userRouter.post("/change-password", changePassword, authMiddleware);
userRouter.post("/update-info",updateUserInfo);
userRouter.post("/forgot-password",sendMail);
userRouter.post("/verify-otp",verifyOtp);
userRouter.post("/reset-password",resetPassword);
userRouter.get("/totalusers", totalUsers)

export default userRouter;