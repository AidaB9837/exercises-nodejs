import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import cors from "cors";
import {
  validate,
  validationErrorMiddleware,
  personSchema,
  PersonData,
} from "./lib/validation";

const corsOptions = { origin: "http://localhost:8080" };

const app = express();

app.use(express.json());

app.use(cors(corsOptions));

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

// PUT /person - replaced a person that exist in db
app.put(
  "/person/:id(\\d+)",
  validate({ body: personSchema }),
  async (req, res, next) => {
    const personID = Number(req.params.id);
    const personData: PersonData = req.body;

    try {
      const person = await prisma.person.update({
        where: { id: personID },
        data: personData,
      });
      res.status(200).json(person);
    } catch (error) {
      res.status(404);
      next(`Cannot PUT /person/${personID}`);
    }
  }
);

// DELETE /person - delete a person that exist in db
app.delete("/person/:id(\\d+)", async (req, res, next) => {
  const personID = Number(req.params.id);

  try {
    await prisma.person.delete({
      where: { id: personID },
    });
    res.status(204).end();
  } catch (error) {
    res.status(404);
    next(`Cannot DELETE /person/${personID}`);
  }
});

app.use(validationErrorMiddleware);

export default app;
