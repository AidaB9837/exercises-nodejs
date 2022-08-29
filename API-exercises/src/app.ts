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
import { initMulterMiddleware } from "./lib/middleware/multer";

const upload = initMulterMiddleware();

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

// POST /person/id/photo - upload a photo file
app.post(
  "/person/:id(\\d+)/photo",
  upload.single("photo"),
  async (req, res, next) => {
    console.log("req.file", req.file);

    if (!req.file) {
      res.status(400);
      return next("No photo file uploaded.");
    }

    const personID = Number(req.params.id);

    const photoFilename = req.file.filename;

    try {
      await prisma.person.update({
        where: { id: personID },
        data: { photoFilename },
      });

      res.status(201).json({ photoFilename });
    } catch (error) {
      res.status(404);
      next(`Cannot POST /person/${personID}/photo`);
    }
  }
);

app.use("/person/photos", express.static("uploads"));

app.use(validationErrorMiddleware);

export default app;
