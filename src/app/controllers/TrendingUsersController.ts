import { Request, Response } from "express";
import { User } from "../models/User";

class TrendingUsersController {
  async index(req: Request, res: Response) {
    const { type = "" } = req.query;
    const users = await User.find({
      where: {
        type,
      },
      order: {
        clicked: "DESC",
      },
      relations: ["post", "icon"],
      select: ["name", "id", "zap", "productType", "post", "icon", "clicked"],
    });
    users.length = 3;
    return res.json(users);
  }
}

export default new TrendingUsersController();
