import axios from "axios";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { POST_API } from "@/constant/variables";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "@/redux/postSlicer";

// import { Button } from "../ui/button";
// import { useRef } from "react";

const CreatePost = ({ open, setOpen }) => {
  // let imageref = useRef();

  let [imag, setImag] = useState(null);
  let [imagePreview, setImagePreview] = useState(null);
  let [loading, setLoading] = useState(false);
  let [caption, setCaption] = useState(null);

  let dispatch = useDispatch();
  let { authUser } = useSelector((store) => store?.user);
  let { posts } = useSelector((store) => store?.post);

  let imageToBaseConverter = (file) => {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  let handleImageUpload = async (e) => {
    let webFile = e?.target?.files?.[0];
    setImag(webFile);
    let base64File = await imageToBaseConverter(webFile);
    setImagePreview(base64File);
  };

  let createPostHandler = async (e) => {
    e?.preventDefault();
    let formData = new FormData();
    formData.append("text", caption);

    if (imagePreview) {
      formData.append("image", imag);
    }

    try {
      setLoading(true);
      let res = await axios.post(`${POST_API}/createPost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      // console.log(res?.data?.post);

      if (res?.data?.success) {
        toast?.success(res?.data?.massage);
        dispatch(setPost([res?.data?.post, ...posts]));
        setOpen(false);
        setCaption(null)
        setImagePreview(null)
        setImag(null)
      }
    } catch (error) {
      toast.error(error?.response?.data?.massage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="font-bold">Create Post</DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar className="w-10">
            <AvatarImage src={authUser?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <h1>{authUser?.fullname}</h1>
            <span className="text-gray-500">bio...</span>
          </div>
        </div>

        <div>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e?.target?.value)}
            placeholder="Type your message here."
          />
        </div>

        <div>
          {imagePreview && (
            <div className="w-full h-64 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="preview_img"
                className="object-cover h-full w-full rounded-lg"
              />
            </div>
          )}
        </div>

        <input type="file" className="" onChange={handleImageUpload} />
        {/* <Button onClick={() => imageref.current.cilck()}>
          Select from computer
        </Button> */}

        {imagePreview &&
          (loading ? (
            <Button className="w-full" type="submit">
              <Loader2 className="w-4 h-4 animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              className="w-full"
              type="submit"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
