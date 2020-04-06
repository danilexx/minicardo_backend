import jwt from "jsonwebtoken";
import { promisify } from "util";
import authConfig from "../../config/auth";
import { User } from "../models/User";

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }
  const [, token] = authHeader.split(" ");
  try {
    const verify: any = promisify(jwt.verify);
    const decoded = await verify(token, authConfig.secret);
    const user = await User.findOne(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid" });
  }
};
