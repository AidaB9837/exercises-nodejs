import express from "express";
import "express-async-errors";

const app = express();

app.get("/people", (req, res) => {
  res.json([
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

export default app;
