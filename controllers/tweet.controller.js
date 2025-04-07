import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

// Create Tweet

export const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body;
    const user = await User.findById(id).select("-password -email")

    if (!(description || id)) {
      return res.status(401).json({
        message: "Fields are required",
        success: false,
      });
    }
if (description ==="" ) {
  return res.status(401).json({
    message: "Empty post",
    success: false,
  });
}
    await Tweet.create({
      description,
      userId: id,
      userDetails: user
    });

    return res.status(201).json({
      message: "Tweet created successfuly",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Delete Tweet

export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    await Tweet.findByIdAndDelete(id);
    return res.status(201).json({
      message: "Tweet deleted successfuly",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// Like or Dislike Tweet

export const likeOrDislike = async (req, res) => {
  try {
    const tweetId = req.params.id;
    const loggedInUserId = req.body.id;
    const tweet = await Tweet.findById(tweetId);
    if (tweet.likes.includes(loggedInUserId)) {
      // dislike
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { likes: loggedInUserId },
      });
      return res.status(201).json({
        message: "Tweet disliked",
        success: true,
      });
    } else {
      // like
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { likes: loggedInUserId },
      });
      return res.status(201).json({
        message: "Tweet liked",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// All Tweets

export const getAllTweet = async (req, res) => {
  try {
    const loggedInUserId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const loggedInUserTweets = await Tweet.find({ userId: loggedInUser?._id});
    const followingUserTweets = await Promise.all(
      loggedInUser.following.map(async (otherUserId) => {
        return await Tweet.find({ userId: otherUserId });
      })
    );
    return res.status(200).json({
      tweets: loggedInUserTweets.concat(...followingUserTweets),
    });
  } catch (error) {
    console.log(error);
  }
};

// Following Tweets

export const getFollowingTweet = async (req, res) => {
  try {
    const loggedInUserId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId);
    const followingUserTweets = await Promise.all(
      loggedInUser.following.map(async (otherUserId) => {
        return await Tweet.find({ userId: otherUserId });
      })
    );
    return res.status(200).json({
      tweets: [].concat(...followingUserTweets)
    });
  } catch (error) {
    console.log(error);
  }
};

