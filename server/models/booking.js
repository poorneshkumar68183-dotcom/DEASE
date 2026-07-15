import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
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

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: false,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    numberOfPersons: {
      type: Number,
      required: true,
      min: 1,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    qrCode: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
status: {
  type: String,
  enum: [
    "PENDING",
    "BOOKED",
    "CANCELLED",
     "REJECTED",
    "COMPLETED"
  ],
  default: "PENDING",
},
    checkedIn: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },
   type: {
  type: String,
  enum: [
    "Darshan",
    "Special Puja",
    "Accommodation"
  ],
  required: true,
}
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Booking", bookingSchema);