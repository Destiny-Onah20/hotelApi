import { ZodSchema, object, string, TypeOf } from "zod";

type adminAttribute = {
  name: string;
  password: string;
  email: string
};

export const adminSchema: ZodSchema<adminAttribute> = object({
  name: string({
    required_error: "name is required."
  }).nonempty().min(2),
  password: string({
    required_error: "Password is required."
  }).nonempty().min(6),
  email: string({
    required_error: "email is required."
  }).nonempty().min(2).email("Invalid email format"),
})
type adminLogin = {
  password: string;
  email: string
};

export const adminLogin: ZodSchema<adminLogin> = object({
  password: string({
    required_error: "Password is required."
  }).nonempty().min(6),
  email: string({
    required_error: "email is required."
  }).nonempty().min(2).email("Invalid email format"),
})
export type loginSchema = Omit<TypeOf<typeof adminSchema>, "hotelName">;

