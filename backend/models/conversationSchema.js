import mongoose from 'mongoose';

let conversationSchema = new mongoose.Schema({
    participation: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    massages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Massage"
        }
    ],
})

let Conversation = mongoose.model("Conversation", conversationSchema)
export default Conversation