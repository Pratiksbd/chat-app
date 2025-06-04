import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Token not available" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user from the decoded token
        const user = await User.findById(decoded.userId).select('-password'); // exclude password for security

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Attach the user to the request object
        req.user = user;

        // Proceed to the next middleware
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(401).json({ error: "Unauthorized, token failed" });
    }
};
