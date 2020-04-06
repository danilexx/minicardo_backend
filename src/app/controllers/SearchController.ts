import { Like } from "typeorm";
import { Request, Response } from "express";

class SearchController {
  async index(req: Request, res: Response) {
    return res.json({});
  }
}

export default new SearchController();
