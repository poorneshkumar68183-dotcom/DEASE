import express from "express";
import { getSlotsByTemple, updateSlot } from "../controllers/slotController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/temples/:id/slots", getSlotsByTemple);
router.put("/slots/:id", authenticateJWT, authorizeRoles(["ADMIN", "ORGANIZER"]), updateSlot);

export default router;
