import * as Yup from "yup";

export const productStoreSchema = Yup.object().shape({
  name: Yup.string().required(),
  price: Yup.number().required(),
});
export const productPutSchema = Yup.object().shape({
  products: Yup.array(
    Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
    })
  ),
});
