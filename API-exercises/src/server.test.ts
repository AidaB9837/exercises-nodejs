import supertest from "supertest";
import { prismaMock } from "./lib/prisma/client.mock";
import app from "./app";

const req = supertest(app);

// GET /person - test to retrieve all persons
describe("GET /person", () => {
  test("Valid request", async () => {
    const persons = [
      {
        id: 1,
        name: "John",
        surname: "Smith",
        age: 30,
        createdAt: "2022-08-25T18:28:13.558Z",
        updatedAt: "2022-08-25T18:26:39.968Z",
      },
      {
        id: 2,
        name: "Lisa",
        surname: "Williams",
        age: 24,
        createdAt: "2022-08-25T18:29:37.878Z",
        updatedAt: "2022-08-25T18:29:16.823Z",
      },
    ];

    // @ts-ignore
    prismaMock.person.findMany.mockResolvedValue(persons);

    const res = await req
      .get("/person")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual(persons);
  });
});

// POST /person - test to create a new person
describe("POST /person", () => {
  test("Valid request", async () => {
    const person = {
      name: "John",
      surname: "Smith",
      age: 30,
    };

    const res = await req
      .post("/person")
      .send(person)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual(person);
  });

  test("Invalid request", async () => {
    const person = {
      surname: "Smith",
      age: 30,
    };

    const res = await req
      .post("/person")
      .send(person)
      .expect(422)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual({ errors: { body: expect.any(Array) } });
  });
});
