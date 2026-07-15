import express from "express";
import { getDonations, createDonation, updateDonationStatus } from "../controllers/donationController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";
import { validateDonation, validateDonationStatus } from "../validators/donationValidator.js";

const router = express.Router();

router.get("/", authenticateJWT, getDonations);
router.post("/", authenticateJWT, validateDonation, createDonation);
router.put("/:id/status", authenticateJWT, authorizeRoles(["ADMIN", "ORGANIZER"]), validateDonationStatus, updateDonationStatus);

export default router;
