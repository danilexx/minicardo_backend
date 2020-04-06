import { Request, Response } from "express";
import { User } from "../models/User";
import { ValidatedRequest } from "../schemas";

class SessionController {
  async store(req: ValidatedRequest, res: Response) {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      relations: ["icon"],
      select: ["passwordHash", "email", "id", "name", "type", "icon"],
    });
    if (!user) {
      return res.status(401).json({
        error: "Usuario não encontrado",
      });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password doesn't match" });
    }
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: user.generateToken(),
    });
  }
}

export default new SessionController();
