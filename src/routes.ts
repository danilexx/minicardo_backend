import { Router } from "express";
import { userStoreSchema } from "./app/schemas/User";
import UserController from "./app/controllers/UserController";
import validateBody from "./app/middlewares/validateBody";
import { sessionStoreSchema } from "./app/schemas/Session";
import SessionController from "./app/controllers/SessionController";
import auth from "./app/middlewares/auth";
import { productStoreSchema, productPutSchema } from "./app/schemas/Product";
import ProductController from "./app/controllers/ProductController";
import PostsController from "./app/controllers/PostsController";
import { multerUploads } from "./app/middlewares/multer";
import FileController from "./app/controllers/FileController";
import { cloudinaryConfig } from "./app/middlewares/cloudnary";
import TrendingUsersController from "./app/controllers/TrendingUsersController";

const routes = Router();
routes.post("/users", validateBody(userStoreSchema), UserController.store);

routes.post(
  "/sessions",
  validateBody(sessionStoreSchema),
  SessionController.store
);
routes.get("/posts/:postId", PostsController.show);
routes.get("/posts", PostsController.index);
routes.get("/trendingUsers", TrendingUsersController.index);

routes.use(auth);
routes.get("/users", UserController.show);
routes.put("/users", UserController.update);
routes.post(
  "/products",
  validateBody(productStoreSchema),
  ProductController.store
);
routes.put(
  "/products",
  validateBody(productPutSchema),
  ProductController.update
);
routes.delete("/products/:id", ProductController.destroy);
routes.post("/files", multerUploads, cloudinaryConfig, FileController.store);

export default routes;
