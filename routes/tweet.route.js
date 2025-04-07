import express from "express"
import { createTweet, deleteTweet, getAllTweet, getFollowingTweet, likeOrDislike } from "../controllers/tweet.controller.js";
import { isAuthenticated } from "../utils/auth.middleware.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createTweet);
router.route("/delete/:id").delete(isAuthenticated, deleteTweet);
router.route("/like/:id").put(isAuthenticated, likeOrDislike);
router.route("/alltweets/:id").get(isAuthenticated, getAllTweet);
router.route("/followingtweets/:id").get(isAuthenticated, getFollowingTweet);

export default router;