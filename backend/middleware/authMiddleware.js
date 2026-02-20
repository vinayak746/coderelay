import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const id = "69980d12aaed8659ddb05951";
    const user = await User.findById(id).select("-password");

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
};

