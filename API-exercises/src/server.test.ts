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

// GET /person - test to retrieve a single person
describe("GET /person/:id", () => {
  test("Valid request", async () => {
    const person = {
      id: 1,
      name: "John",
      surname: "Smith",
      age: 30,
      createdAt: "2022-08-25T18:28:13.558Z",
      updatedAt: "2022-08-25T18:26:39.968Z",
    };

    // @ts-ignore
    prismaMock.person.findUnique.mockResolvedValue(person);

    const res = await req
      .get("/person/1")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual(person);
  });

  test("Person does not exist", async () => {
    // @ts-ignore
    prismaMock.person.findUnique.mockResolvedValue(null);

    const res = await req
      .get("/person/18")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(res.text).toContain("Cannot GET /person/18");
  });

  test("Invalid personID", async () => {
    const res = await req
      .get("/person/asdf")
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(res.text).toContain("Cannot GET /person/asdf");
  });
});

// POST /person - test to create a new person
describe("POST /person", () => {
  test("Valid request", async () => {
    const person = {
      id: 5,
      name: "John",
      surname: "Smith",
      age: 30,
      createdAt: "2022-08-26T18:03:16.997Z",
      updatedAt: "2022-08-26T18:03:17.000Z",
    };

    // @ts-ignore
    prismaMock.person.create.mockResolvedValue(person);

    const res = await req
      .post("/person")
      .send({
        name: "John",
        surname: "Smith",
        age: 30,
      })
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

// PUT /person - test to replaced a person that exist in db
describe("PUT /person/:id", () => {
  test("Valid request", async () => {
    const person = {
      id: 5,
      name: "John",
      surname: "Smith",
      age: 30,
      createdAt: "2022-08-26T18:03:16.997Z",
      updatedAt: "2022-08-26T18:03:17.000Z",
    };

    // @ts-ignore
    prismaMock.person.update.mockResolvedValue(person);

    const res = await req
      .put("/person/5")
      .send({
        name: "John",
        surname: "Smith",
        age: 45,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual(person);
  });

  test("Invalid request", async () => {
    const person = {
      surname: "Smith",
      age: 30,
    };

    const res = await req
      .put("/person/18")
      .send(person)
      .expect(422)
      .expect("Content-Type", /application\/json/);

    expect(res.body).toEqual({ errors: { body: expect.any(Array) } });
  });

  test("Person does not exist", async () => {
    // @ts-ignore
    prismaMock.person.update.mockRejectedValue(new Error("Error"));

    const res = await req
      .put("/person/18")
      .send({
        name: "John",
        surname: "Smith",
        age: 45,
      })
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(res.text).toContain("Cannot PUT /person/18");
  });

  test("Invalid personID", async () => {
    const res = await req
      .put("/person/asdf")
      .send({
        name: "John",
        surname: "Smith",
        age: 45,
      })
      .expect(404)
      .expect("Content-Type", /text\/html/);

    expect(res.text).toContain("Cannot PUT /person/asdf");
  });
});
