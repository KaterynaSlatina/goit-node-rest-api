import * as fs from "node:fs/promises";
import * as path from "node:path";
import User from "../models/user.js";

export const uploadAvatar = async (req, res, next) => {
  // console.log(req.file);
  try {
    await fs.rename(
      req.file.path,
      path.join(process.cwd(), "public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename },
      { new: true }
    );

    if (user === null) {
      return res.status(401).send({ message: "Not authorized" });
    }
    res.send({
      user: {
        avatarUrl: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(401).send({ message: "Not authorized" });
    }
    if (user.avatar === null) {
      return res.status(401).send({ message: "No avatar" });
    }
    res.sendFile(path.join(process.cwd(), "public/avatars", user.avatar));
  } catch (error) {
    next(error);
  }
};
