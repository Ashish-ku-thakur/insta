import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MoreHorizontal } from "lucide-react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa"; // fill
import { FaRegComment } from "react-icons/fa";
import { IoSendOutline } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";
import { CiBookmarkCheck } from "react-icons/ci"; //fill
import CommentDialog from "./CommentDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { POST_API } from "@/constant/variables";
import { setPost, setSelectedPost } from "@/redux/postSlicer";
import { useState } from "react";
import { Badge } from "../ui/badge";

const Post = ({ data }) => {
  let { authUser } = useSelector((store) => store?.user);
  let { posts } = useSelector((store) => store?.post);

  let [open, setOpen] = useState(false);
  let [text, setText] = useState(""); // post's comment text

  let [like, setLike] = useState(data?.likes?.includes(authUser?._id) || false);
  let [postLikeCount, setPostLikeCount] = useState(data?.likes?.length);

  let [comment, setComment] = useState(data?.comments);
  let dispatch = useDispatch();

  // delete Post
  let deletePosthandler = async (data) => {
    try {
      let res = await axios.delete(`${POST_API}/deletePost/${data?._id}`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        toast?.success(res?.data?.massage);
        let updatedPost = posts?.filter((po) => po?._id != data?._id); // this is so good
        dispatch(setPost(updatedPost));
      }
    } catch (error) {
      toast.error(error?.response?.data?.massage);
    }
  };

  // like or dislike
  let likeorDislikeHandler = async (data) => {
    try {
      let action = like ? "dislikePost" : "likePost";
      axios.defaults.withCredentials = true;
      let res = await axios.patch(`${POST_API}/${action}/${data?._id}`);

      if (res?.data?.success) {
        let updateCount = like ? postLikeCount - 1 : postLikeCount + 1;
        setPostLikeCount(updateCount);
        setLike(!like);
        toast?.success(res?.data?.massage);
        console.log(like, action, { postCount: postLikeCount });

        //this is complicated but this is update our store
        let updatePostStore = posts?.map((po) =>
          po?._id == data?._id
            ? {
                ...po,
                likes: like
                  ? po?.likes?.filter((uid) => uid != authUser?._id)
                  : [...po.likes, authUser?._id],
              }
            : po
        );
        dispatch(setPost(updatePostStore));
      }
    } catch (error) {
      toast?.error(error?.response?.data?.massage);
    }
  };

  // comment create
  let commentHandler = async (data) => {
    try {
      let res = await axios.post(
        `${POST_API}/commentCreate/${data?._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log(res?.data);
      if (res?.data?.success) {
        let updatedCommentPost = [...comment, res?.data?.comment];
        setComment(updatedCommentPost);

        let updatePostData = posts?.map((po) =>
          po?._id == data?._id
            ? {
                ...po,
                comments: updatedCommentPost,
              }
            : po
        );
        dispatch(setPost(updatePostData));
        setText("");
        toast?.success(res?.data?.massage);
      }
    } catch (error) {
      toast.error(error?.response?.data?.massage);
    }
  };

  // console.log(data?.caption);

  return (
    // post
    <div className="my-5 w-full max-w-sm mx-auto shadow-xl p-2">
      {/* avtar + fullname + post img */}
      <div className="flex items-center justify-between">
        {/* avatar + fullname */}
        <div className="flex gap-2 items-center">
          <Avatar className="w-10">
            <AvatarImage src={data?.author?.profilePicture} alt="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex gap-4 items-center">
            <h1>{data?.author?.fullname}</h1>
            {authUser?._id == data?.author?._id && (
              <Badge varient="secondary">author</Badge>
            )}
          </div>
        </div>

        {/* post ... Diaglog */}
        <Dialog className="flex gap-4 ">
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>

          <DialogContent className="w-full flex flex-col gap-7 items-center justify-between">
            <Button
              varient="ghost"
              className="cursor-pointer w-fit text-red-400"
            >
              Unfollow
            </Button>
            <Button varient="ghost" className="cursor-pointer w-fit ">
              Add to favrout
            </Button>
            {authUser && authUser?._id == data?.author?._id && (
              <Button
                onClick={() => deletePosthandler(data)}
                varient="ghost"
                className="cursor-pointer w-fit text-red-400"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* post image */}
      <div>
        <img
          className="rounded-sm my-2 w-full aspect-square object-cover"
          src={data?.image}
          alt="post img"
        />
      </div>

      {/* icons */}
      <div className="w-full flex gap-3 justify-between items-center">
        <div className="w-full flex gap-3 items-center ">
          {/* LIKE ICON */}
          {like ? (
            <FaHeart
              onClick={() => likeorDislikeHandler(data)}
              size={"30px"}
              className="cursor-pointer"
            />
          ) : (
            <CiHeart
              onClick={() => likeorDislikeHandler(data)}
              size={"30px"}
              className="cursor-pointer"
            />
          )}

          <FaRegComment
            onClick={() => {
              dispatch(setSelectedPost(data));
              setOpen(true);
            }}
            size={"22px"}
            className="cursor-pointer"
          />
          <IoSendOutline size={"22px"} className="cursor-pointer" />
        </div>

        <div>
          <CiBookmark size={"22px"} className="cursor-pointer" />
        </div>
      </div>

      {/* likes comments and diaglog for comment */}
      <div>
        <span>{postLikeCount} likes</span>

        <p className="flex gap-3">
          <h2>{data?.author?.fullname}</h2>
          <h2>{data?.caption}</h2>
        </p>

        {/* comment diaglog open when i clicked and passed the setOpen and open as propes */}
        <div>
          {comment?.length > 0 && (
            <p
              onClick={() => {
                dispatch(setSelectedPost(data));
                setOpen(true);
              }}
              className="text-slate-400 text-sm cursor-pointer"
            >
              view all {comment?.length} comments
            </p>
          )}

          <CommentDialog open={open} setOpen={setOpen} />
        </div>
      </div>

      {/* create comment handler */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="add a comment"
          value={text}
          onChange={(e) => setText(e?.target?.value)}
          className="outline-none text-sm w-full"
        />

        {text && (
          <span
            onClick={() => commentHandler(data)}
            className="text-red-400 cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
