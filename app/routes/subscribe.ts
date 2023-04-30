import { ActionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const validator = withZod(
  z.object({
    email: z.string().min(1, { message: "Имэйл хоосон байна!" }).email("Имэйл хаяг буруу байна!"),
  })
);

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const email = body.get('email');
}
 