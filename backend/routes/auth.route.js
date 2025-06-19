import express from "express";
import { registerUser, verifyingToken, loginUser, logoutUser,  forgotPassword, resetPassword, deleteUser } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/register-user", registerUser);
route.get("/verify-token", verifyingToken);
route.post("/login-user", loginUser);
route.get("/logout-user", logoutUser);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password/:resetPasswordToken", resetPassword);
route.get("/delete-user", authenticatedUser, deleteUser);



export default route;
