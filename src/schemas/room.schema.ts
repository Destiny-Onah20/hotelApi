import { ZodSchema, object, string, TypeOf, ZodError, number } from "zod";

type roomAttribute = {
  roomNumber: number;
  roomDescription: string;
  price: number;
  image: string;
};

export const roomSchema: ZodSchema<roomAttribute> = object({
  roomNumber: number().transform((value) => {
    // Attempt to convert the value to a number
    const numericValue = Number(value);

    // Check if the conversion was successful
    if (isNaN(numericValue)) {
      throw new Error('Price must be a valid number');
    }

    return numericValue;
  }),
  roomDescription: string({
    required_error: "Room description is required."
  }).nonempty(),
  price: number().min(1000, "Price must be above ₦1000'")
    .transform((value) => {
      // Attempt to convert the value to a number
      const numericValue = Number(value);

      // Check if the conversion was successful
      if (isNaN(numericValue)) {
        throw new Error('Price must be a valid number');
      }

      return numericValue;
    }),
  image: string({
    required_error: "Room description is required."
  }).nonempty(),
});

