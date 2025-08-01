import { User } from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.ts";


export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401);
        res.json({ success: false, message: "Invalid credentials" });
    }
    if (user.role === "admin" && email !== "admin@admin.com") {
        res.status(403);
        res.json({ success: false, message: "Invalid admin credentials" });
    }

    const tokenPayload = {
        _id: user._id,
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(
        tokenPayload,
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "10d" }
    );

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            },
            token: token,
        },
    });
});

