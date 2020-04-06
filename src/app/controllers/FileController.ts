import { Request, Response } from "express";
import { dataUri } from "../middlewares/multer";
import { uploader } from "../middlewares/cloudnary";
import { File } from "../models/File";

class FileController {
  async store(req: Request, res: Response) {
    // const file = dataUri(req).content;
    const result = await uploader.upload(req.body.image);
    const image = result.url;
    const dbFile = File.create({
      url: image,
    });
    await dbFile.save();
    return res.status(200).json(dbFile);
    // return res.status(400).json({ error: "Imagem não recebida" });
  }
}

export default new FileController();
