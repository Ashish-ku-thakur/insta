import { useSelector } from "react-redux";
import Post from "./Post";

const Posts = () => {
  let arr = [1, 1, 2, 23, 34];

  let { posts } = useSelector((store) => store?.post);


  if (!posts) {
    return "";
  }
  return (
    <div>
      {posts.map((el) => (
        <Post key={el?._id} data={el} />
      ))}
    </div>
  );
};

export default Posts;
