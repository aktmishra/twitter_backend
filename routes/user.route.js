import express from "express";
import { Bookmarks, follow, getOtherUser, getUserProfile, Login, Logout, Register, Unfollow } from "../controllers/user.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").post(Logout);
router.route("/bookmark/:id").put(isAuthenticated, Bookmarks);
router.route("/profile/:id").get(isAuthenticated, getUserProfile);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUser);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, Unfollow);

export default router;