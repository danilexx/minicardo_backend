import dotenv from "dotenv";

dotenv.config();

const authConfig = {
  secret: process.env.SECRET,
  expiresIn: process.env.TOKEN_EXPIRES,
};
export default authConfig;
