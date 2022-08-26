import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import {
  validate,
  validationErrorMiddleware,
  personSchema,
  PersonData,
} from "./lib/validation";

const app = express();

app.use(express.json());

// GET /person - retrieve all persons
app.get("/person", async (req, res) => {
  const person = await prisma.person.findMany();
  res.json(person);
});

// POST /person - create a new person
app.post("/person", validate({ body: personSchema }), async (req, res) => {
  const personData: PersonData = req.body;

  const person = await prisma.person.create({ data: personData });
  res.status(201).json(person);
});

app.use(validationErrorMiddleware);

export default app;
