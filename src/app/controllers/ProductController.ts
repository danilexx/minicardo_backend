import { Response } from "express";
import {
  ValidatedRequest,
  AuthenticatedAndValidatedRequest,
  AuthenticatedRequest,
} from "../schemas";
import { Product } from "../models/Product";
import { User } from "../models/User";

interface ProductStoreBody {
  name: string;
  price: number;
}

interface ProductUpdateBody {
  products: any[];
}

class ProductController {
  async store(
    req: AuthenticatedAndValidatedRequest<any, ProductStoreBody>,
    res: Response
  ) {
    const { body, user } = req;
    const product = Product.create({ ...body, user });
    await product.save();
    return res.json(product);
  }

  async update(
    req: AuthenticatedAndValidatedRequest<any, ProductUpdateBody>,
    res: Response
  ) {
    const { body: data, user } = req;
    await Product.save(data.products);
    user.products = data.products;
    await user.save();
    return res.json(user.products);
  }

  async destroy(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    const { user } = req;
    const { id } = req.params;
    const product = await Product.findOne(id);
    if (product) {
      await product.remove();
      if (product.user.id !== user.id) {
        return res.status(404).json({
          error: "Esse produto não te pertence",
        });
      }
    }

    return res.json({ ok: true });
  }
}

export default new ProductController();
