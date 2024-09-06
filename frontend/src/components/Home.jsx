import useGetAllPost from "@/hooks/useGetAllPost";
import Feed from "./sidebar/Feed";

const Home = () => {
  useGetAllPost();
  return (
    <div>
      <div>
        <Feed />
      </div>
    </div>
  );
};

export default Home;
