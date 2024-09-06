import Comment from "../models/commentSchema.js";
import Post from "../models/postSchema.js";
import User from "../models/userschema.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudnari.js";

export let AddnewPost = async (req, res) => {
  try {
    let caption = req.body.text;
    let userId = req.id;
    // let receiverId = req.params.id;
    let image = req.file;

    if (!caption) {
      return res
        .status(400)
        .json({ massage: "caption is required", success: false });
    }

    // if (!receiverId)
    //   return res
    //     .status(400)
    //     .json({ massage: "receiverId is required", success: false });

    if (!image)
      return res
        .status(400)
        .json({ massage: "image is required", success: false });

    if (!userId)
      return res
        .status(400)
        .json({ massage: "you are not authhenticated", success: false });

    //image ka kaam horaha hai
    let optimizeImageBuffer = await sharp(image.buffer)
      .resize({ width: 500, height: 500, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    let fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString(
      "base64"
    )}`;

    let cloudResponse = await cloudinary.uploader.upload(fileUri);
    // console.log(cloudResponse);

    // image ke kaam ke baad post create ker du
    let post = await Post.create({
      image: cloudResponse.secure_url,
      author: userId,
      caption,
    });

    let user = await User.findById(userId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "fullname profilePicture" });

    return res.status(201).json({
      massage: "New Post added",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetAllPost = async (req, res) => {
  try {
    let post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "fullname profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "fullname profilePicture" },
      });
    // console.log(post);

    if (!post) {
      return res.status(400).json({
        massage: "no posts",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export let UserPost = async (req, res) => {
  try {
    let userId = req.id;

    // let user = await User.findById(userId)
    //   .sort({ createdAt: -1 })
    //   .populate({ path: "author", select: "fullname, prfilePicture" });

    let post = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "fullname profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "fullname profilePicture" },
      });

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export let LikePost = async (req, res) => {
  try {
    let userId = req.id;
    let postId = req.params.id;

    if (!postId) {
      return res.status(401).json({
        massage: "poseId id not defined",
        success: false,
      });
    }

    let post = await Post.findById(postId);

    //like logic
    await post.updateOne({ $addToSet: { likes: userId } }); // addToSet use to set only unique address or id
    await post.save();

    // socket io
    return res.status(200).json({
      massage: "post liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export let DislikePost = async (req, res) => {
  try {
    let userId = req.id;
    let postId = req.params.id;

    if (!postId) {
      return res.status(401).json({
        massage: "poseId id not defined",
        success: false,
      });
    }

    let post = await Post.findById(postId);

    //like logic
    await post.updateOne({ $pull: { likes: userId } }); // addToSet use to set only unique address or id
    await post.save();

    // socket io
    return res.status(200).json({
      massage: "post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export let AddCommentOnPost = async (req, res) => {
  try {
    let userId = req.id;
    let postId = req.params.id;
    let text = req.body.text;

    if (!text) {
      return res.status(401).json({
        massage: "text is required",
        success: false,
      });
    }

    let post = await Post.findById(postId);

    let comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    })
    await comment.populate({ path: "author", select: "fullname profilePicture" });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      massage: "Comment created",
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetCommentOnPost = async (req, res) => {
  try {
    let userId = req.id;
    let postId = req.params.id;

    if (!postId) {
      return res.status(401).json({
        massage: "postId is not defined",
        success: false,
      });
    }

    let comment = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "fullname profilePicture",
    });

    if (!comment) {
      return res
        .status(401)
        .json({ massage: "no comments found for this post", success: false });
    }
    return res.status(201).json({ comment, success: true });
  } catch (error) {
    console.log(error);
  }
};

export let DeletePost = async (req, res) => {
  try {
    let userId = req.id;
    let postId = req.params.id;

    if (!postId) {
      return res.status(200).json({
        massage: "postId is not define",
        success: false,
      });
    }

    let post = await Post.findById(postId);

    if (post.author.toString() != userId)
      return res
        .status(401)
        .json({ massage: "you are not authenticated", success: false });

    await Post.findByIdAndDelete(postId);

    //after delete we have to delete in user or bookmarks se bhi hatao
    let user = await User.findById(userId);

    user.posts = user.posts.filter((ids) => ids.toString() != postId);
    user.bookmarks = user.bookmarks.filter((ids) => ids.toString() != postId);
    await user.save();

    // comments bhi related/assositated delete kerna hai

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ massage: "Post deleted", success: true });
  } catch (error) {
    console.log(error);
  }
};

export let Bookmarks = async (req, res) => {
  try {
    let userId = req.id;
    let postId = req.params.id;

    if (!postId) {
      return res.status(401).json({
        massage: "postId is not define",
        success: false,
      });
    }

    let user = await User.findById(userId);
    let post = await Post.findById(postId);

    if (user.bookmarks.includes(post._id)) {
      //pull
      // user.bookmarks = user.bookmarks.filter((ids) => ids.toString() != postId);
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();

      return res.status(200).json({
        massage: "post unbookmarked",
        success: true,
      });
    } else {
      //push
      await user.updateOne({ $push: { bookmarks: post._id } });
      await user.save();

      return res.status(200).json({
        massage: "post bookmarked",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
