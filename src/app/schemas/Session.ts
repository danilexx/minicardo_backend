import * as Yup from "yup";

export const sessionStoreSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});
