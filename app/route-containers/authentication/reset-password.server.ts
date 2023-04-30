import { ActionArgs, json } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { passwordValidator } from "~/validators";

export const action = async ({ request }: ActionArgs) => {
  let [formData] = await Promise.all([
    request.formData(),
  ]);

  const validationResult = await passwordValidator.validate(formData);
  if (validationResult.error) return validationError(validationResult.error);

  try {
  } catch(error) {
    console.error(error);
  }

  return json({});
}