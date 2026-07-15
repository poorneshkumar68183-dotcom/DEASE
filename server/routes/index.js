import express from "express";
import authRoutes from "./authRoutes.js";
import templeRoutes from "./templeRoutes.js";
import slotRoutes from "./slotRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import donationRoutes from "./donationRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/temples", templeRoutes);
router.use("/", slotRoutes); // Handles /temples/:id/slots and /slots/:id
router.use("/bookings", bookingRoutes);
router.use("/donations", donationRoutes);

export default router;
