import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "DEVOTIONAL_HARMONY_SECRET_KEY";

export const authenticateJWT = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authorization token required",
    });
  }

  try {

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(403).json({
        error: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(403).json({
      error: "Invalid or expired token",
    });

  }

};

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Requires role: ${roles.join(" or ")}` });
    }
    next();
  };
};
