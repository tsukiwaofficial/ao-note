import express, { Router } from "express";
import { login, logout, refreshAccessToken, signup } from "./user.controller";

const router: Router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/refresh", refreshAccessToken);

export default router;
