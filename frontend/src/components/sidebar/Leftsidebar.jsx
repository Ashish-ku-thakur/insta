import { USER_API } from "@/constant/variables";
import { setAuthUser } from "@/redux/userSlicer";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import {
  Heart,
  Home,
  LogOutIcon,
  MessageSquareShare,
  PlusCircle,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { setPost, setSelectedPost } from "@/redux/postSlicer";

const Leftsidebar = () => {
  let { authUser } = useSelector((store) => store?.user);
  let [open, setOpen] = useState(false);

  let sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <MessageSquareShare />, text: "Massage" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusCircle />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage src={authUser?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOutIcon />, text: "Logout" },
  ];

  let navigate = useNavigate();
  let dispatch = useDispatch();

  //logout handler
  let logoutHandler = async () => {
    try {
      let res = await axios.get(`${USER_API}/logout`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPost([]));
        navigate("/login");
        toast.success(res?.data?.massage);
      }
    } catch (error) {
      toast.error(error?.response?.data?.massage);
    }
  };

  let sidebarHandler = (typeText) => {
    try {
      // alert(typeText)
      if (typeText == "Logout") {
        logoutHandler();
      } else if (typeText == "Create") {
        setOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <div className="w-[18%] border-r h-screen p-3 fixed top-0 left-0 z-10">
        <h1>Logo</h1>

        {sidebarItems.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex gap-7 items-center hover:bg-gray-200 rounded-xl cursor-pointer p-4 my-5"
            >
              <div className="w-[35px] rounded-full">{item.icon}</div>
              <span className="font-bold">{item.text}</span>
            </div>
          );
        })}
      </div>

      <div>
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};
export default Leftsidebar;
