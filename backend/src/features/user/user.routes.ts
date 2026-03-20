import express, { Router } from "express";
import {
  getUserDetails,
  login,
  logout,
  refreshAccessToken,
  signup,
  updateAvatar,
  updateDisplayName,
} from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router: Router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/refresh", refreshAccessToken);
router.get("/:id", authMiddleware, getUserDetails);
router.put("/:id/avatar", authMiddleware, updateAvatar);
router.put("/:id/name", authMiddleware, updateDisplayName);

export default router;
