import { ZodSchema, number, object, string } from "zod";

type userAttribute = {
  fullname: string;
  password: string;
  email: string;
  phoneNumber: string;
};

export const userSchema: ZodSchema<userAttribute> = object({
  fullname: string({
    required_error: "hotelName is required."
  }).nonempty().min(2),
  password: string({
    required_error: "Password is required."
  }).nonempty().min(6),
  email: string({
    required_error: "email is required."
  }).nonempty().min(2).email("Invalid email format"),
  phoneNumber: string({
    required_error: "phone-number is required."
  }).min(2),
  confirmPassword: string({
    required_error: "required."
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password does not match",
  path: ["confirmPassword"]
})

