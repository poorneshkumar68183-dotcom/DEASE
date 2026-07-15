import express from "express";
import { getBookings, createBooking, updateBookingStatus,cancelBooking } from "../controllers/bookingController.js";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware.js";
import { validateBooking, validateBookingStatus } from "../validators/bookingValidator.js";

const router = express.Router();

router.get("/", authenticateJWT, getBookings);
router.post("/", authenticateJWT, validateBooking, createBooking);
router.put("/:id/status", authenticateJWT, authorizeRoles(["ADMIN", "ORGANIZER"]), validateBookingStatus, updateBookingStatus);
router.put("/:id/cancel", authenticateJWT, cancelBooking);

export default router;
