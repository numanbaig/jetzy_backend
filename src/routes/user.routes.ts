import express from "express";
import { loginUser } from "../controllers/user.controller.ts";

const router = express.Router();

router.post("/login", loginUser);


export default router;