import supertest from "supertest";
import app from "./app";

const req = supertest(app);

test("GET /people", async () => {
  const res = await req
    .get("/people")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(res.body).toEqual([
    {
      name: "John",
      surname: "Smith",
      age: 30,
    },
    {
      name: "Lisa",
      surname: "Williams",
      age: 24,
    },
    {
      name: "Michael",
      surname: "Jones",
      age: 18,
    },
  ]);
});
