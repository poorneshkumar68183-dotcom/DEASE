import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    location: {
  type: String,
  default: "India",
},

devotionLevel: {
  type: String,
  enum: ["Bronze", "Silver", "Gold", "Platinum"],
  default: "Bronze"
},

verified: {
  type: Boolean,
  default: false,
},

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN", "ORGANIZER"],
      default: "USER",
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    
  }
);

export default mongoose.model("User", userSchema);