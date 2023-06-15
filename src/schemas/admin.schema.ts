import { ZodSchema, object, string, TypeOf } from "zod";

type adminAttribute = {
  hotelName: string;
  password: string;
  email: string
};

export const adminSchema: ZodSchema<adminAttribute> = object({
  hotelName: string({
    required_error: "hotelName is required."
  }).nonempty().min(2),
  password: string({
    required_error: "Password is required."
  }).nonempty().min(6),
  email: string({
    required_error: "email is required."
  }).nonempty().min(2).email("Invalid email format"),
})

export type loginSchema = Omit<TypeOf<typeof adminSchema>, "hotelName">;

