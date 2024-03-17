import * as fs from "node:fs/promises";
import * as path from "node:path";
import User from "../models/user.js";
const avatarsDir = path.join("public", "avatars");
import Jimp from "jimp";

export const uploadAvatar = async (req, res, next) => {
  // console.log(req.file);

  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const newFileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, newFileName);

    await fs.rename(tempUpload, resultUpload);

    const image = await Jimp.read(resultUpload);
    await image.resize(250, 250).write(resultUpload);

    const avatarURL = path.join("avatars", newFileName);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
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
    res.sendFile(path.join(process.cwd(), "public", user.avatarURL));
  } catch (error) {
    next(error);
  }
};
