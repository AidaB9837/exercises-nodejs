import supertest from "supertest";
import { prismaMock } from "../lib/prisma/client.mock";
import app from "../app";

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
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");

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
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");

    expect(res.body).toEqual(person);
  });

  test("Person does not exist", async () => {
    // @ts-ignore
    prismaMock.person.findUnique.mockResolvedValue(null);

    const res = await req
      .get("/person/18")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("Cannot GET /person/18");
  });

  test("Invalid personID", async () => {
    const res = await req
      .get("/person/asdf")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("Cannot GET /person/asdf");
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
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");

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

// PUT /person - test to replace a person that exist in db
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
      .expect("Content-Type", /application\/json/)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");

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
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("Cannot PUT /person/18");
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
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("Cannot PUT /person/asdf");
  });
});

// DELETE /person - test to delete a single person
describe("DELETE /person/:id", () => {
  test("Valid request", async () => {
    await req
      .delete("/person/1")
      .expect(204)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");
  });

  test("Person does not exist", async () => {
    // @ts-ignore
    prismaMock.person.delete.mockRejectedValue(new Error("Error"));

    const res = await req
      .delete("/person/18")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("Cannot DELETE /person/18");
  });

  test("Invalid personID", async () => {
    const res = await req
      .delete("/person/asdf")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("Cannot DELETE /person/asdf");
  });
});

// POST /person/id/photo -test to upload a photo file
/**
 * These test depend on: src/lib/middleware/multer.mock.ts
 * It uses multer.memoryStorage, so no files are written to disk.
 */
describe("POST /person/:id/photo", () => {
  test("Valid request with PNG file upload", async () => {
    await req
      .post("/person/18/photo")
      .attach("photo", "test-fixtures/photos/lisa-williams.png")
      .expect(201)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080");
  });

  test("Valid request with JPG file upload", async () => {
    await req
      .post("/person/18/photo")
      .attach("photo", "test-fixtures/photos/john-smith.jpg")
      .expect(201)
      .expect("Access-Control-Allow-Origin", "http://localhost:8080")
      .expect("Access-Control-Allow-Credentials", "true");
  });

  test("Invalid request with text file upload", async () => {
    const res = await req
      .post("/person/18/photo")
      .attach("photo", "test-fixtures/photos/file.txt")
      .expect(500)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain(
      "Error: The uploaded file must be a JGP or a PNG image."
    );
  });

  test("Person does not exist", async () => {
    //@ts-ignore
    prismaMock.person.update.mockRejectedValue(new Error("Error"));

    const res = await req
      .post("/person/18/photo")
      .attach("photo", "test-fixtures/photos/lisa-williams.png")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("Cannot POST /person/18/photo");
  });

  test("Invalid personID", async () => {
    const res = await req
      .post("/person/asdf/photo")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("Cannot POST /person/asdf/photo");
  });

  test("Invalid request with no file upload", async () => {
    const res = await req
      .post("/person/18/photo")
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(res.body.message).toContain("No photo file uploaded.");
  });
});
