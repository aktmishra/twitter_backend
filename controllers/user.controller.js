import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
 

dotenv.config({
  path: "../.env",
});

//User Register

export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!(name || email || username || password)) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "User already exist",
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 16);

    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfuly",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// User Login

export const Login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!(email || username)) {
      return res.status(401).json({
        message: "email or username is required",
        success: false,
      });
    }
    if (!password) {
      return res.status(401).json({
        message: "Password is required",
        success: false,
      });
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    const loggedInUser = await User.findById(user?._id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User does not exist",
        success: false,
      });
    }
    const isMatch = await bcryptjs.compare(password, user?.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Password is incorrect",
        success: false,
      });
    }
    const tokenData = {
      userId: user?._id,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", HttpOnly: true })
      .json({
        message: `Welcome back ${loggedInUser?.name}`,
        success: true,
        loggedInUser
      });
  } catch (error) {
    console.log(error);
  }
};

// User Logout

export const Logout = async (req, res) => {
  res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
    message: "Logout successfuly",
    success: true,
  });
};

// Bookmarks

export const Bookmarks = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;
    const user = await User.findById(loggedInUserId);
    if (user.bookmarks.includes(tweetId)) {
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { bookmarks: tweetId },
      });
      return res.status(201).json({
        message: "Removed from bookmark",
        success: true,
      });
    } else {
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { bookmarks: tweetId },
      });
      return res.status(201).json({
        message: "Save to bookmark",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// User Profile

export const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// Get other user profile

export const getOtherUser = async (req, res) => {
  try {
    const id = req.params.id;
    const otherUser = await User.find({ _id: { $ne: id } }).select("-password");
    if (!otherUser) {
      return res.status(401).json({
        message: "Currenty dont have any users",
      });
    }
    return res.status(201).json({
      otherUser,
    });
  } catch (error) {
    console.log(error);
  }
};

// Follow

export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `User already following ${user.name} `,
      });
    }

    return res.status(200).json({
      message: `${loggedInUser.name} just followed to ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Unfollow

export const Unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);
    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: "User has not followed yet",
      });
    }

    return res.status(200).json({
      message: `${loggedInUser.name} unfollow ${user.name}`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

