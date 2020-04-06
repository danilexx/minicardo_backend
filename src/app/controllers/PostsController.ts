import { Request, Response } from "express";
import { ILike } from "../../utils/ExtraOperators";
import { User } from "../models/User";

class PostsController {
  async index(
    req: Request<{ searchParams: string; type: string; page: string }>,
    res: Response
  ) {
    const { searchParams = "", type, page = 1, itemsPerPage } = req.query;
    const itemsPage = itemsPerPage || "9";
    const offset = (Number(page) - 1) * Number(itemsPage);
    const users = await User.find({
      skip: offset,
      take: Number(itemsPage),
      where: [
        {
          type,
          name: ILike(`%${searchParams}%`),
        },
        {
          type,
          productType: ILike(`%${searchParams}%`),
        },
      ],
      order: {
        name: "ASC",
      },
      relations: ["post", "icon"],
      select: ["name", "id", "zap", "productType", "post", "icon"],
    });
    const total = await User.count({
      skip: offset,
      take: Number(itemsPage),
      where: [
        {
          type,
          name: ILike(`%${searchParams}%`),
        },
        {
          type,
          productType: ILike(`%${searchParams}%`),
        },
      ],
      order: {
        name: "ASC",
      },
      relations: ["post", "icon"],
      select: ["name", "id", "zap", "productType", "post", "icon"],
    });
    return res.json({
      total,
      items: users.length,
      currentPage: page,
      pages: Math.ceil(total / itemsPage),
      users,
    });
  }

  async show(req: Request<{ postId: string }>, res: Response) {
    const { postId } = req.params;
    const user = await User.findOne(postId, {
      relations: ["products"],
    });
    if (!user) {
      return res.status(404).json({
        error: "Post não encontrado",
      });
    }
    user.clicked += 1;
    await user.save();
    return res.json(user);
  }
}

export default new PostsController();
