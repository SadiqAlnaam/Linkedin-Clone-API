import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSeuggestedConnections, updateProfile } from "../controllers/user.controller.js";
import { getPublicProfile } from "../controllers/user.controller.js";
import { upload } from "../lib/uploadImg.js";

const router = express.Router();

router.get("/suggestions", protectRoute, getSeuggestedConnections);
router.get("/:username", protectRoute, getPublicProfile);


router.put("/profile", protectRoute, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'bannerImg', maxCount: 1 }
]), updateProfile)

export default router;