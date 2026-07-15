import Donation from "../models/Donation.js";
import Temple from "../models/Temple.js";

export const getDonations = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "Unauthorized" });

    let donations;

    if (req.user.role === "ADMIN" || req.user.role === "ORGANIZER") {
      donations = await Donation.find()
        .populate("user", "name email")
        .populate("temple", "name");
    } else {
      donations = await Donation.find({
        user: req.user._id,
      }).populate("temple", "name");
    }

    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDonation = async (req, res) => {
  try {
    const {
      amount,
      templeId,
      paymentMethod,
      message,
      anonymous,
      donorName,
    } = req.body;

    const temple = await Temple.findById(templeId);

    if (!temple) {
      return res.status(404).json({
        error: "Temple not found",
      });
    }

    const donation = await Donation.create({
      user: req.user._id,
      temple: templeId,
      amount: Number(amount),
      donorName: anonymous ? "Anonymous Devotee" : donorName || req.user.name,
      anonymous,
      paymentMethod,
      paymentStatus: "PENDING",
      transactionId: `TXN-${Date.now()}`,
      message,
    });

    res.status(201).json(donation);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: req.body.status,
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        error: "Donation not found",
      });
    }

    res.json(donation);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};