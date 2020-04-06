import * as Yup from "yup";

const validateBody = (schema, canPass: boolean = false) => async (
  req,
  res,
  next
) => {
  try {
    await schema.validate(req.body, {
      abortEarly: false,
    });
    // Validation passed
    req.isValid = true;
    return next();
  } catch (err) {
    if (canPass) {
      req.isValid = false;
      return next();
    }
    const validationErrors: any = {};
    if (err instanceof Yup.ValidationError) {
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
    }
    return res.status(400).json({ errors: validationErrors });
  }
};

export default validateBody;
