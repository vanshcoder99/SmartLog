import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const router = Router();

router.post("/sign-up", registerUser);

export default router;
