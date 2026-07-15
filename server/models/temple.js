import mongoose from "mongoose";

const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 4.5,
    },

    nextAvailableSlot: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Popular",
    },
pujas: [
  {
    id: String,
    name: String,
    description: String,
    price: Number,
    duration: String,
  },
],

    darshanPrice: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
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

export default mongoose.model("Temple", templeSchema);