import { Request, Response } from "express";
import { ILike } from "../../utils/ExtraOperators";
import { User } from "../models/User";

class PostsController {
  async index(
    req: Request<{ searchParams: string; type: string; page: string }>,
    res: Response
  ) {
    const { searchParams, type, page, itemsPerPage } = req.query;
    const itemsPage = itemsPerPage || "10";
    const offset = (Number(page) - 1) * Number(itemsPage);
    const user = await User.find({
      skip: offset,
      take: Number(itemsPerPage),
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
      select: ["name", "id", "zap", "address", "productType"],
    });
    return res.json(user);
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
