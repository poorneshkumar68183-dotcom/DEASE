export const validateDonation = (req, res, next) => {
  const {
    amount,
    templeId,
    paymentMethod,
  } = req.body;

  if (!amount || !templeId || !paymentMethod) {
    return res.status(400).json({
      error: "Amount, Temple and Payment Method are required",
    });
  }

  next();
};
export const validateDonationStatus = (req, res, next) => {
  const { status } = req.body;

  if (
    status !== "SUCCESS" &&
    status !== "FAILED"
  ) {
    return res.status(400).json({
      error: "Invalid status"
    });
  }

  next();
};
