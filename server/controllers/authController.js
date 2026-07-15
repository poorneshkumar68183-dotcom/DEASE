import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "DEVOTIONAL_HARMONY_SECRET_KEY";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists with this email",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
      role:
        role === "ADMIN" || role === "ORGANIZER"
          ? role
          : "USER",
      location: location || "India",
    });

    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );


  res.status(201).json({
    token,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      devotionLevel: newUser.devotionLevel,
      verified: newUser.verified,
      location: newUser.location
    }
  });
    } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        devotionLevel: user.devotionLevel,
        verified: user.verified,
        location: user.location,
      },
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

export const getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};
