import {
  registerUser,
  loginUser,
  updateAccountDetails,
  updateUserAvatar,
  getCurrentUser,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { Router } from "express";
const userRouter = Router();

userRouter.post("/register",upload.single("avatar"), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me/current", verifyJWT, getCurrentUser);
userRouter.put("/me", verifyJWT, updateAccountDetails);
userRouter.put("/me/avatar", upload.single("avatar"), verifyJWT, updateUserAvatar);
userRouter.post("/logout", verifyJWT, logout);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.put("/change-password", verifyJWT, changeCurrentPassword);

export default userRouter;
