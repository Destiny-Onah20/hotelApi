import { ZodSchema, object, string, TypeOf, ZodError, number } from "zod";

type roomAttribute = {
  roomNumber: number;
  roomDescription: string;
  price: number;
  image: string;
};

export const roomSchema: ZodSchema<roomAttribute> = object({
  roomNumber: number({
    required_error: "Room number is required."
  }),
  roomDescription: string({
    required_error: "Room description is required."
  }).nonempty(),
  price: number({
    required_error: "email is required."
  }).min(3, "Price must be above ₦1000"),
  image: string({
    required_error: "Room description is required."
  }).nonempty(),
});