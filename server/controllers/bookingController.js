import Booking from "../models/Booking.js";
import Temple from "../models/Temple.js";
import Slot from "../models/Slot.js";

export const getBookings = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "Unauthorized" });

    let bookings;
    
    if (req.user.role === "ADMIN" || req.user.role === "ORGANIZER") {
      bookings = await Booking.find()
        .populate("user", "name email")
        .populate("temple", "name")
        .populate("slot", "name slotTime");
    } else {
      bookings = await Booking.find({ user: req.user._id })
        .populate("temple", "name")
        .populate("slot", "name slotTime");
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      templeId,
      slotId,
      date,
      slotTime,
      visitorsCount,
      totalAmount,
      serviceName,
      type,
    } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple)
      return res.status(404).json({ error: "Temple not found" });
    
    let bookingStatus = "BOOKED";

// Special Puja & Accommodation require approval
if (
  type === "Special Puja" ||
  type === "Accommodation"
) {
  bookingStatus = "PENDING";
}

   let slot = null;

if (slotId) {
  slot = await Slot.findById(slotId);

  if (!slot) {
    return res.status(404).json({
      error: "Slot not found",
    });
  }

  if (slot.availableSeats < Number(visitorsCount)) {
    return res.status(400).json({
      error: "Not enough seats available",
    });
  }
if (bookingStatus === "BOOKED") {
  slot.booked += Number(visitorsCount);
  slot.availableSeats -= Number(visitorsCount);

  if (slot.availableSeats <= 0) {
    slot.availableSeats = 0;
    slot.status = "FULL";
  }

  await slot.save();
}
}


    const booking = await Booking.create({
      user: req.user._id,
      temple: templeId,
      slot: slot ? slot._id : null,
      bookingDate: new Date(date),
      numberOfPersons: Number(visitorsCount),
      totalAmount: Number(totalAmount),
      paymentStatus: "SUCCESS",
      status: bookingStatus,
      checkedIn: false,
      notes: serviceName,
      type:type ,
      qrCode: bookingStatus === "BOOKED"
  ? `BOOK-${Date.now()}`
  : "",
    });

   const populatedBooking = await Booking.findById(booking._id)
  .populate("slot")
  .populate("temple");

res.status(201).json(populatedBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)
      .populate("slot");

    if (!booking)
      return res.status(404).json({
        error: "Booking not found"
      });

    const status = req.body.status;

    if (status === "Approved") {

      booking.status = "BOOKED";

      booking.qrCode = `BOOK-${Date.now()}`;

      if (booking.slot) {

        booking.slot.booked += booking.numberOfPersons;

        booking.slot.availableSeats -= booking.numberOfPersons;

        if (booking.slot.availableSeats <= 0) {
          booking.slot.availableSeats = 0;
          booking.slot.status = "FULL";
        }

        await booking.slot.save();
      }

    } else {

      booking.status = "REJECTED";

    }

    await booking.save();

    res.json(booking);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found",
      });
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};