import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentMethod: {
      type: String,
      enum: [
        "UPI",
        "CARD",
        "NETBANKING",
        "CASH"
      ],
      default: "UPI",
    },

    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "SUCCESS",
        "FAILED"
      ],
      default: "SUCCESS",
    },

    transactionId: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    donorName: {
      type: String,
      default: "",
    },

    anonymous: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Donation", donationSchema);