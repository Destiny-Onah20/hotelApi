import { ZodType, z } from "zod";
import { RequestHandler } from "express";

type AdminAttributes = {
  hotelName: string;
  password: string;
  email: string
}
const schemaObj = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({}),
});

export const validates = (schema: ZodType<AdminAttributes>): RequestHandler => (req, res, next) => {
  try {
    schemaObj.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    schema.parse(req.body);

    next()
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

type adminLogin = {
  password: string;
  email: string
}

export const loginValidate = (schema: ZodType<adminLogin>): RequestHandler => (req, res, next) => {
  try {
    schemaObj.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    schema.parse(req.body);

    next()
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

type userAttribute = {
  fullname: string;
  password: string;
  email: string;
  phoneNumber: number;
};


export const validateUser = (Userschema: ZodType<userAttribute>): RequestHandler => (req, res, next) => {
  try {
    schemaObj.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    Userschema.parse(req.body);

    next()
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    })
  }
};

