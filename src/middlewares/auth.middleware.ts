import jwt from "jsonwebtoken"; 
import { asyncHandler } from "../utils/asyncHandler.ts";
import { User } from "../models/user.model.ts";


export const verifyJWT = asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            res.status(401).json({ message: "No access token provided" })
            return;
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password")
        if (!user) {
            throw new res.status(401, "Invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid Access Token" })
        
    }
})