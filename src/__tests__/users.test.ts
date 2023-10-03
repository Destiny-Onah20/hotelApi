import * as UserController from "../controllers/users.controller";
import { v4 as uuid } from "uuid";
import app from "../app";
import supertest from 'supertest';

const userId = 1;
const user = userId + 1;

const userPayloade = {
  fullname: "Favour Igbani",
  email: "onahdestinyoh20@gmail.com",
  password: "75673f",
  confirmPassword: "75673f",
  phoneNumber: "0902024709k"
};

const userData = {
  fullname: 'testuser',
  email: 'test@example.com',
  password: 'testpassword',
  confirmPassword: "testpassword",
  phoneNumber: '09020241704'
};
describe("users", () => {

  describe("users registeration", () => {

    describe("given that the email has not been used by any other user", () => {
      it("should return the user payload", async () => {
        //@ts-ignore
        const createUserMock = jest.spyOn(UserController, 'registerUser').mockReturnValueOnce(userPayloade);

        const { statusCode, body } = await supertest(app).post("/app/v1//user/register").send(userData);
        expect(statusCode).toBe(201);
        expect(body).toBe(userPayloade);
        expect(createUserMock).toHaveBeenCalledWith(userData);
      })
    })
  })

  describe("given that the email and password does not match", () => {
    it("should return a 400", () => {

    })
  })

  describe("given that the controllers throws", () => {
    it("should return a 500 error", () => {

    })
  })
});