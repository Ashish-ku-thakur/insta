import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { AvatarImage } from "../ui/avatar";

const Comment = ({ comment }) => {
// console.log(comment);

  return (
    <div className="mb-10">
      <div className="flex gap-3 items-center">
        <Avatar className="w-10">
          <AvatarImage src={comment?.author?.profilePicture} alt="A_img" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <h2 className="font-bold text-sm mr-3">{comment?.author?.fullname}</h2><span className="font-normal">{comment?.text}</span>
      </div>
    </div>
  );
};

export default Comment;
