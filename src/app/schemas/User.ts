import * as Yup from "yup";

export const userStoreSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  type: Yup.string().oneOf(["deliveryman", "trader"]).required(),
  zap: Yup.string().required().min(15),
  productType: Yup.string().nullable(),
  iconId: Yup.number(),
  postId: Yup.number(),
});
