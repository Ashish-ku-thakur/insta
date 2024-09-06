import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { POST_API } from "@/constant/variables";
import axios from "axios";
import { setPost } from "@/redux/postSlicer";
import { toast } from "sonner";

const CommentDialog = ({ open, setOpen }) => {
  let [text, setText] = useState("");
  let { selectedPost, posts } = useSelector((store) => store?.post);
  let [comment, setComment] = useState(selectedPost?.comments);

  let dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.comments);
    }
  }, [selectedPost]);

  let changeEventHandler = (e) => {
    let inputText = e?.target?.value;

    if (inputText?.trim()) {
      //in starting is not blanck
      setText(inputText);
    } else {
      setText("");
    }
  };

  let sendMassageHandler = async (data) => {
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
      if (res?.data?.success) {
        let updatedCommentPost = [...comment, res?.data?.comment];
        setComment(updatedCommentPost);

        let updatePostData = posts?.map((po) =>
          po?._id == data?._id
            ? {
                ...po,
                comments: comment,
              }
            : po
        );
        dispatch(setPost(updatePostData));

        toast?.success(res?.data?.massage);
        setText("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.massage);
      console.log(error);
    }
  };
  // console.log({"se;ected":selectedPost?.comments}, comment)

  return (
    // comment diaglog
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex-col"
      >
        <div className="flex flex-1">
          {/* leftImage */}
          <div className="w-1/2">
            <img
              className="rounded-lg w-full h-full object-cover"
              src={selectedPost?.image}
              alt="post img"
            />
          </div>

          {/* right */}
          <div className="w-1/2 flex-col flex justify-between">
            {/* comment dialog + AVATAR +fullname ... */}
            <div className="flex items-center justify-between p-2">
              {/* avatar icon +fullname + BIO */}
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="">
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture}
                      className="w-10"
                      alt="post img"
                    />

                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                {/* avtarname + bio */}
                <div>
                  <Link className="flex gap-4">
                    <div>{selectedPost?.author?.fullname}</div>
                    {/* <span>bio here...</span> */}
                  </Link>
                </div>
              </div>

              {/*post ... comment */}
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>

                <DialogContent>
                  <Button className="bg-red-400">Unfollow</Button>
                  <Button>Add to Favrouit</Button>
                </DialogContent>
              </Dialog>
            </div>

            <hr className="border-black" />

            {/* comment text */}
            <div className="flex-1 overflow-y-auto max-h-[33rem] px-4">
              {comment?.map((com) => (
                <Comment key={com?._id} comment={com} />
              ))}
            </div>

            {/* post button + text field */}
            <div className="p-2 flex gap-2">
              <input
                type="text"
                name=""
                value={text}
                onChange={changeEventHandler}
                placeholder="add a comment..."
                className="outline-none w-full border border-gray-300 p-2 rounded-md "
              />

              <Button
                disabled={!text}
                onClick={() => sendMassageHandler(selectedPost)}
                varient="outline"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
