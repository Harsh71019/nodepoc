import request from "supertest";
import { app } from "../server";

let token: string;

beforeAll((done) => {
  request(app)
    .post("/api/v1/user/login")
    .send({
      email: "harsh@gmail.com",
      password: "Harsh710",
    })
    .end((err, response) => {
      //@ts-ignore
      token = response._body.token;
      done();
    });
});

//Login user
describe("Create Post", () => {
  test("Login without credentials", async () => {
    const response = await request(app)
          .post("/api/v1/user/login")
          .send({});
      expect(response.statusCode).toBe(401);
  });

  test("Create with wrong password or email", async () => {
    const response = await request(app)
          .post("/api/v1/user/login")
          .send({
              email: "harsh@gmail.com",
              password: "heytest",
          });
      expect(response.statusCode).toBe(401);
  });

  test("Login with proper response", async () => {
    const response = await request(app)
          .post("/api/v1/user/login")
          .send({
            email: "harsh@gmail.com",
            password: "Harsh710",
          });
      expect(response.statusCode).toBe(200);
  });
});

// Register user

//Logout User

//Logout all devices

//Delete All users
