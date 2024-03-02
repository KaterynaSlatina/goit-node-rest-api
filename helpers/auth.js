import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authHeader.split(" ", 2);
  //   console.log({ bearer, token });

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired" });
      }
      console.error(err);

      return res.status(401).send({ message: "Not authorized" });
    }
    //   console.log(decode);

    const user = await User.findById(decode.id);
    if (!user || user.token !== token) {
      return res.status(401).send({ message: "Not authorized" });
    }
    // if (user.token !== token) {
    //   return res.status(401).send({ message: "Not authorized" });
    // }
    req.user = {
      id: decode.id,
    };

    next();
  });
};

export default auth;
