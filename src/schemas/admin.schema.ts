import { ZodSchema, object, string, TypeOf, ZodError } from "zod";

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
  }).nonempty().min(6, "Password must be atleast six (6) characters long"),
  email: string({
    required_error: "email is required."
  }).nonempty().min(2).email("Invalid email format"),
})
type adminLogin = {
  password: string;
  email: string
};

// const validateAdminData = async (adminData: adminAttribute): Promise<string[] | null> => {
//   try {
//     await adminSchema.parseAsync(adminData);
//     return null; // No errors
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessages = error.errors.map((err) => err.message);
//       return errorMessages;
//     }
//     throw error;
//   }
// };





export const adminLogin: ZodSchema<adminLogin> = object({
  password: string({
    required_error: "Password is required."
  }).nonempty().min(6),
  email: string({
    required_error: "email is required."
  }).nonempty().min(2).email("Invalid email format"),
})
export type loginSchema = Omit<TypeOf<typeof adminSchema>, "hotelName">;

