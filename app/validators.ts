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


export const checkoutCustomerDataValidator = withZod(
  z.object({
    emailAddress: z.string()
      .min(1, { message: 'Имэйл хаяг хоосон байна' })
      .email('Имэйл хаяг буруу байна'),
    firstName: z.string().min(1, { message: 'Нэр хоосон байна' }),
    lastName: z.string().min(1, { message: 'Овог хоосон байна' }),
  })
);


export const signUpValidator = withZod(
  z.object({
      email: z
        .string()
        .min(1, { message: 'Имэйл хаяг хоосон байна' })
        .email('Имэйл хаяг буруу байна'),
      firstName: z.string().min(1, { message: 'Нэр хоосон байна' }),
      lastName: z.string().min(1, { message: 'Овог хоосон байна' }),
      password: z.string().min(1, { message: 'Нууц үг хоосон байна' }),
      repeatPassword: z.string().min(1, { message: 'Нууц үг хоосон байна' }),
    })
    .refine(
      ({ password, repeatPassword }) => password === repeatPassword,
      {
        path: ['repeatPassword'],
        message: 'Нууц үг тохирохгүй байна',
      },
    ),
);


export const checkoutAddressValidator = withZod(
  z.object({
    fullName: z.string().min(1, { message: 'Нэр хоосон байна' }),
    company: z.string(),
    countryCode: z.string(),
    streetLine1: z.string().min(1, { message: 'Хаяг хоосон байна' }),
    phoneNumber: z.string().min(1, { message: 'Утасны дугаар хоосон байна' }),
  })
);


export const checkoutProductValidator = withZod(
  z.object({
    variantId: z.string().min(1, { message: "Product variant is not set"})
  })
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