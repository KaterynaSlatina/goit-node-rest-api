import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { registerSchema } from "../schemas/userSchemas.js";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = User.create({
      name,
      email: normalizedEmail,
      password: passwordHash,
    });
    if (newUser) {
      const { email, subscription } = req.body;
      res.status(201).json({ user: { email, subscription } });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "23h" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.send({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.body;
  res.status(200).json({ email, subscription });
};

export default { register };
