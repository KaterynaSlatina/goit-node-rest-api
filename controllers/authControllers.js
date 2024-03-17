import "dotenv/config";
import crypto from "node:crypto";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

// const message = {
//   from: "slatina.katerina@gmail.com",
//   to: "slatina.katerina@gmail.com",
//   subject: "Hello ✔",
//   text: "Hello world?",
//   html: "<b>Hello world?</b>",
// };

// transport.sendMail(message).then(console.log).catch(console.error);

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    await transport
      .sendMail({
        to: email,
        from: "slatina.katerina@gmail.com",
        subject: "Welcome to the app",
        text: `To confirm registration, please, click the link http://localhost:3000/api/users/verify/${verificationToken}`,
        html: `To confirm registration, please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      })
      .then(console.log)
      .catch(console.error);

    const avatarURL = gravatar.url(normalizedEmail);

    const newUser = await User.create({
      name,
      verificationToken,
      email: normalizedEmail,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email,
        subscription: newUser.subscription,
        avatarURL,
      },
    });
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

    if (user.verify === false) {
      return res.status(401).send({ message: "Your account is not verified" });
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
  const { email, subscription } = req.user;

  res.status(200).json({
    user: {
      email,
      subscription,
    },
  });
};

export const verify = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOne({ verificationToken });

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = User.findOne({ email });

    if (!user) {
      res.status(401).send({ message: "Email not found" });
    }

    if (user.verify) {
      res.status(400).send({ message: "Verification has already been passed" });
    }

    await transport.sendMail({
      to: email,
      from: "slatina.katerina@gmail.com",
      subject: "Welcome to the app",
      text: `To confirm registration, please, click the link http://localhost:3000/api/users/verify/${user.verificationToken}`,
      html: `To confirm registration, please click on the <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
    });

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export default { register };
