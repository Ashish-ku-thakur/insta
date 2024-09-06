import mongoose from 'mongoose';

let commentSchema = new mongoose.Schema({

    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },// kisne likha
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // kis post per likha

}, { timestamps: true })

let Comment = mongoose.model("Comment", commentSchema)
export default Comment