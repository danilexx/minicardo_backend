import { Request, Response } from "express";
import { string } from "yup";
import { User } from "../models/User";
import {
  ValidatedRequest,
  AuthenticatedRequest,
  AuthenticatedAndValidatedRequest,
} from "../schemas";
import { Product } from "../models/Product";
import { File } from "../models/File";

interface UserBody {
  email: string;
  name: string;
  zap: string;
  password: string;
  iconId?: number;
  postId?: number;
  type: "deliveryman" | "trader";
}

type UserPutBody = Partial<
  UserBody & {
    newPassword: string;
    confirmNewPassword: string;
  }
>;
type UserStoreBody = UserBody;

class UserController {
  async show(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    const { user } = req;
    const products = await Product.find({
      where: {
        user,
      },
    });
    return res.json({ ...user, products });
  }

  async store(req: ValidatedRequest<any, UserStoreBody>, res: Response) {
    const data = req.body;
    const preExistingUser = await User.findOne({
      where: { email: data.email },
    });
    if (preExistingUser) {
      return res.status(400).json({ error: "Usuario ja criado" });
    }
    const user = User.create(data);
    user.password = data.password;
    if (data.iconId) {
      const icon = await File.findOne(data.iconId);
      if (icon) {
        user.icon = icon;
      }
    }
    if (data.postId) {
      const post = await File.findOne(data.postId);
      if (post) {
        user.post = post;
      }
    }
    await User.save(user);
    const { name, email, type, zap, id, address } = user;
    return res.json({ name, email, type, zap, id, address });
  }

  async update(
    req: AuthenticatedAndValidatedRequest<any, UserPutBody>,
    res: Response
  ) {
    const { user } = req;
    const { password, confirmNewPassword, newPassword, ...data } = req.body;
    User.merge(user, data);
    if (data.iconId) {
      const icon = await File.findOne(data.iconId);
      if (icon) {
        user.icon = icon;
        await user.save();
      }
    }
    if (data.postId) {
      const post = await File.findOne(data.postId);
      if (post) {
        user.post = post;
      }
    }
    if (password && confirmNewPassword && newPassword) {
      const isValidPassword = await user.checkPassword(password);
      if (newPassword !== confirmNewPassword) {
        return res.status(404).json({
          error: "Nova senha e sua confirmação não batem",
        });
      }
      if (!isValidPassword) {
        return res.status(404).json({
          error: "Senha provida não é valida",
        });
      }
      user.password = newPassword;
    }
    if (user.icon && data.iconId === null) {
      user.icon = null;
    }
    if (user.post && data.postId === null) {
      user.post = null;
    }
    await user.save();
    return res.json(user);
  }

  async destroy(req: AuthenticatedRequest<{ id: string }>, res: Response) {
    const { user } = req;
    const { id } = req.params;
    const product = await Product.findOne(id);
    if (product.user.id !== user.id) {
      return res.status(404).json({
        error: "O Produto não te pertence",
      });
    }
    await product.remove();
    return res.json({ ok: true });
  }
}

export default new UserController();
