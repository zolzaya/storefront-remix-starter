import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const passwordValidator = withZod(
  z.object({
    email: z.string().min(1, { message: "Имэйл хоосон байна!" }).email("Имэйл хаяг буруу байна!"),
  })
);


export const emailValidator = withZod(
  z.object({
    email: z.string().min(1, { message: "Имэйл хоосон байна!" }).email("Имэйл хаяг буруу байна!"),
  })
);


export const loginValidator = withZod(
  z.object({
    email: z.string().min(1, { message: "Имэйл хоосон байна!" }).email("Имэйл хаяг буруу байна!"),
    password: z.string().min(1, { message: "Нууц үгээ оруулна уу!" }),
  })
);