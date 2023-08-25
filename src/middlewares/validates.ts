import { ZodError, ZodType, z } from "zod";
import { RequestHandler } from "express";

type AdminAttributes = {
  name: string;
  password: string;
  email: string
}
const schemaObj = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({}),
});

export const validates = (schema: ZodType<AdminAttributes>): RequestHandler => async (req, res, next) => {
  try {
    schemaObj.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    await schema.parseAsync(req.body);
    next()
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((error) => error.message);
      return res.status(400).json({
        message: errorMessages[0]
      });
    }
    return res.status(500).json({
      message: error.message
    })
  }
};

type adminLogin = {
  password: string;
  email: string
}

export const loginValidate = (schema: ZodType<adminLogin>): RequestHandler => async (req, res, next) => {
  try {
    schemaObj.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    await schema.parseAsync(req.body);
    next()
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((err) => err.message);
      return res.status(400).json({
        message: errorMessages[0]
      });
    }
    return res.status(500).json({
      message: error.message
    })
  }
};

type userAttribute = {
  fullname: string;
  password: string;
  email: string;
  phoneNumber: string;
};


export const validateUser = (Userschema: ZodType<userAttribute>): RequestHandler => async (req, res, next) => {
  try {
    schemaObj.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    await Userschema.parseAsync(req.body);
    next()
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((err) => err.message);
      return res.status(400).json({
        message: errorMessages[0]
      });
    }
    return res.status(500).json({
      message: error.message
    })
  }
};

