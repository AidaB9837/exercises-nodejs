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

// GET /person - retrieve a single person
app.get("/person/:id(\\d+)", async (req, res, next) => {
  const personId = Number(req.params.id);

  const person = await prisma.person.findUnique({ where: { id: personId } });

  if (!person) {
    res.status(404);
    return next(`Cannot GET /person/${personId}`);
  }

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
