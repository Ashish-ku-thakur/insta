import { POST_API } from "@/constant/variables";
import { setPost } from "@/redux/postSlicer";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

let useGetAllPost = () => {
  let dispatch = useDispatch();
  useEffect(() => {
    fetchAllPost();
  }, []);

  let fetchAllPost = async () => {
    try {
      let res = await axios.get(`${POST_API}/getAllpost`, {
        withCredentials: true,
      });

      if (res?.data?.success) {
        dispatch(setPost(res?.data?.post));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export default useGetAllPost;
