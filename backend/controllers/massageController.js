import Conversation from "../models/conversationSchema.js";
import Massage from "../models/massageSchema.js";

export let SendMassage = async (req, res) => {
  try {
    let userId = req.id;
    let receiverId = req.params.id;
    let text = req.body.text;

    if (!receiverId || !text) {
      return res.status(401).json({
        massage: "receiverId & text id required",
        success: false,
      });
    }

    let conversation = await Conversation.findOne({
      participation: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      //  stablish conversastion
      conversation = await Conversation.create({
        participation: [userId, receiverId],
      });
    }

    let newMassage = await Massage.create({
      senderId: userId,
      receiverId,
      massage: text,
    });

    if (newMassage) {
      //  stablish conversastion
      conversation.massages.push(newMassage._id);
    }

    await Promise.all([conversation.save(), newMassage.save()]);

    // socket io

    return res.status(201).json({
      massage: "newMassage createed",
      success: true,
      newMassage,
    });
  } catch (error) {
    console.log(error);
  }
};

export let GetAllMassages = async (req, res) => {
  try {
    let userId = req.id;
    let receiverId = req.params.id;

    if (!receiverId) {
      return res.status(401).json({
        massage: "receiverId is required",
        success: false,
      });
    }

    let conversation = await Conversation.findOne({
      participation: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json({
        massage: [],
        success: true,
      });
    }

    return res.status(200).json({
      massage: conversation?.massages,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};



