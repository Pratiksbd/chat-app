import { generateToken } from "../libs/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const login =async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error:"Invalid crediantials"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if ( !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid cridential"});
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error with login controller", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }

}

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        if (password.length < 6) {
            return res.status(400).json({ error: "Please enter password longer than 6" })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "Email already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        })
        if (newUser) {
            await newUser.save()
            generateToken(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({ error: "Invalid user data" })
        }

    }
    catch (error) {
        console.log("Error occured in signup comtroller", error.message);
        return res.status(500).json({ error: "Internal server error " });
    }
}

export const logout = async(req, res) => {
   try {
     res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
   } catch (error) {
    console.log("Error in Logout controller", error.message);
    res.status(500).json({error:"Internal server error"});
   }
}

// export const updateProfile = async(req, res) => {
//     const {}
// }

export const checkAuth = async(req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({error:"Internal server error"});
    }
}