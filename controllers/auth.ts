import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 1. Define options with explicit type
    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
    };

    // 2. Pass the variable directly into the function
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      signOptions,
    );

    return res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
