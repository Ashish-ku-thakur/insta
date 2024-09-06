import User from "../models/userschema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudnari.js";
import Post from "../models/postSchema.js";

export let Register = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(401).json({
        massage: "Somethis is missing Please check! All fielda are required",
        success: false,
      });
    }

    // check user is already exist or not
    let user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        massage: "this email is already exist please try different email",
        success: false,
      });
    }

    // hash password
    let hashPassword = await bcrypt.hash(password, 10);

    let createUser = await User.create({
      fullname,
      email,
      password: hashPassword,
    });

    return res.status(201).json({
      massage: "Account create successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export let Login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        massage: "email and password is required",
        success: false,
      });
    }

    // email validation
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        massage: "email and password is not right",
        success: false,
      });
    }

    //password validation
    let isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(401).json({
        massage: "password and email is not right",
        success: false,
      });
    }

    // if all right then send cookie
    let options = {
      userId: user._id,
    };

    let token = await jwt.sign(options, process.env.JwT_SECRET, {
      expiresIn: "1d",
    });

    let populatedPost = await Promise.all(
      user.posts.map(async (ids) => {
        let post = await Post.findById(ids);

        if (post.length == 0) {
          return null;
        } else {
          return post;
        }
      })
    );

    user = {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      followings: user.followings,
      posts: populatedPost,
      bookmarks: user.bookmarks,
      gender: user.gender,
    };

    return res
      .status(200)
      .cookie("uid", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        massage: `welcome back ${user.fullname}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

export let Logout = async (req, res) => {
  try {
    return res.status(200).cookie("uid", "", { maxAge: 0 }).json({
      success: true,
      massage: "logout user successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetSelectedUserProfile = async (req, res) => {
  try {
    let selectedUserId = req.params.id;

    if (selectedUserId == undefined) {
      return res.status(401).json({
        massage: "selecteduserid is not defined",
        success: false,
      });
    }

    let selectedUser = await User.findById(selectedUserId).select("-password");

    if (!selectedUser) {
      return res.status(401).json({
        massage: "selecteduserid is not exist",
        success: false,
      });
    }

    return res.status(200).json({
      selectedUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//
export let EditUserProfile = async (req, res) => {
  try {
    let userId = req.id;

    if (!userId) {
      return res.status(401).json({
        massage: "userId is not defined",
        success: false,
      });
    }

    let { bio, gender } = req.body;
    // console.log(bio, gender);

    let profilePicture = req.file;

    let cloudResponse;

    if (profilePicture) {
      let fileUri = getDataUri(profilePicture);
      // check fileUri ko
      // console.log(fileUri);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        massage: "user not found",
        success: false,
      });
    }

    if (bio) {
      user.bio = bio;
    }
    if (gender) {
      user.gender = gender;
    }
    if (profilePicture) {
      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      massage: "profile updateed",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetOtherUser = async (req, res) => {
  try {
    let userId = req.id;

    if (!userId) {
      return res.status(401).json({
        massage: "userId is not defined",
        success: false,
      });
    }

    let otherUser = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    if (!otherUser) {
      return res.status(400).json({
        massage: "currently you do not have any otherUser",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      otherUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export let FollowOrUnfollow = async (req, res) => {
  try {
    let userId = req.id; // follower kerne wala
    let otherUserId = req.params.id; // jise follow kia ja raha hai

    if (!userId || !otherUserId) {
      return res.status(401).json({
        massage: "userId & selectedId is not provided",
        success: false,
      });
    }

    let user = await User.findById(userId);
    let otheruser = await User.findById(otherUserId);

    let isFollowing = user.followings.includes(otherUserId);

    if (isFollowing) {
      // pull
      await Promise.all([
        User.updateOne({ _id: userId }, { $pull: { followings: otherUserId } }),
        User.updateOne({ _id: otherUserId }, { $pull: { followers: userId } }),
      ]);

      return res.status(200).json({
        massage: "unFollowed succesfully",
        success: true,
      });
    } else {
      //push
      await Promise.all([
        User.updateOne({ _id: userId }, { $push: { followings: otherUserId } }),
        User.updateOne({ _id: otherUserId }, { $push: { followers: userId } }),
      ]);

      return res.status(200).json({
        massage: "followed succesfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
