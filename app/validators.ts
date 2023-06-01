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


export const customerChangePasswordValidator = withZod(
  z
    .object({
      currentPassword: z.string().min(1, { message: 'Нууц үг хоосон байна' }),
      newPassword: z.string().min(1, { message: 'Нууц үг хоосон байна' }),
      confirmPassword: z.string().min(1, { message: 'Нууц үг хоосон байна' }),
    })
    .refine(
      ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
      {
        path: ['confirmPassword'],
        message: 'Нууц үг тохирохгүй байна',
      },
    ),
);


export const customerProfileValidator = withZod(
  z.object({
    title: z.string(),
    firstName: z.string().min(1, { message: 'Нэр хоосон байна' }),
    lastName: z.string().min(1, { message: 'Овог хоосон байна' }),
    phoneNumber: z.string().min(1, { message: 'Утасны дугаар хоосон байна' }),
  }),
);


export const customerChangeEmailValidator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: 'Имэйл хаяг хоосон байна' })
      .email('Имэйл хаяг буруу байна'),
    password: z.string().min(1, { message: 'Нууц үг хоосон байна' }),
  }),
);