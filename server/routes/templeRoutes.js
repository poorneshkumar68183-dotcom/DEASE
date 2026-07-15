import express from "express";
import { getAllTemples, getTempleById, createTemple } from "../controllers/templeController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTemples);
router.get("/:id", getTempleById);
router.post("/", authenticateJWT, authorizeRoles(["ADMIN", "ORGANIZER"]), createTemple);

export default router;
