export const validateBooking = (req, res, next) => {
  const { templeId, slotTime, date, visitorsCount, type, serviceName, totalAmount } = req.body;

  if (!templeId || !slotTime || !date || !visitorsCount || !type || !serviceName || !totalAmount) {
    return res.status(400).json({ error: "Missing required booking details" });
  }
  next();
};

export const validateBookingStatus = (req, res, next) => {
  const { status } = req.body;
  if (status !== "Approved" && status !== "Declined") {
    return res.status(400).json({ error: "Invalid status value" });
  }
  next();
};
