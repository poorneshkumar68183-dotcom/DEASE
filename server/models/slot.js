import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    period: {
      type: String,
      required: true,
    },

    slotTime: {
      type: String,
      required: true,
    },

    availableSeats: {
      type: Number,
      default: 100,
    },

    totalSeats: {
      type: Number,
      default: 100,
    },

    booked: {
      type: Number,
      default: 0,
    },

    limit: {
      type: Number,
      default: 100,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "FULL", "CLOSED"],
      default: "AVAILABLE",
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Slot", slotSchema);