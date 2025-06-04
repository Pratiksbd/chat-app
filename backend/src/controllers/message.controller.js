import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params
        const senderId = req.user._id;

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
        })
        await newMessage.save();

        //Todo real time functionality using websocket
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error Sending message", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSideBar: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error getting message", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}