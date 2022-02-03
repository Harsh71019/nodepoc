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

describe("Create Post", () => {
  test("Dont Create no data", () => {
    return request(app)
      .post("/api/v1/post")
      .send({})
      .then((response) => {
        expect(response.statusCode).toBe(422);
      });
  });

  test("Dont Create no data", () => {
    return request(app)
      .post("/api/v1/post")
      .send({
        title: "Hey test creating a post",
        description: "I am successful or not lets see",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
      });
  });

  test("Create Proper Data", () => {
    return request(app)
      .post("/api/v1/post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Hey test creating a post",
        description: "I am successful or not lets see",
      })
      .then((response) => {
        expect(response.statusCode).toBe(201);
      });
  });
});

describe("Dont get Posts if no token", () => {
  test("It should require authorization", () => {
    return request(app)
      .get("/api/v1/post")
      .then((response) => {
        expect(response.statusCode).toBe(401);
      });
  });

  test("Get all post", () => {
    return request(app)
      .get("/api/v1/post")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.type).toBe("application/json");
      });
  });
});
