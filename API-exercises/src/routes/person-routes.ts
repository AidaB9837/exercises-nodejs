import express, { Router } from "express";
import prisma from "../lib/prisma/client";
import {
  validate,
  personSchema,
  PersonData,
} from "../lib/middleware/validation";
import { initMulterMiddleware } from "../lib/middleware/multer";
import { checkAuthorization } from "../lib/middleware/passport";

const upload = initMulterMiddleware();

const router = Router();

// GET /person - retrieve all persons
router.get("/", async (req, res) => {
  const person = await prisma.person.findMany();
  res.json(person);
});

// GET /person - retrieve a single person
router.get("/:id(\\d+)", async (req, res, next) => {
  const personId = Number(req.params.id);

  const person = await prisma.person.findUnique({ where: { id: personId } });

  if (!person) {
    res.status(404);
    return next(`Cannot GET /person/${personId}`);
  }

  res.json(person);
});

// POST /person - create a new person
router.post(
  "/",
  checkAuthorization,
  validate({ body: personSchema }),
  async (req, res) => {
    const personData: PersonData = req.body;
    const username = req.user?.username as string;

    const person = await prisma.person.create({
      data: {
        ...personData,
        createdBy: username,
        updatedBy: username,
      },
    });
    res.status(201).json(person);
  }
);

// PUT /person - replaced a person that exist in db
router.put(
  "/:id(\\d+)",
  checkAuthorization,
  validate({ body: personSchema }),
  async (req, res, next) => {
    const personID = Number(req.params.id);
    const personData: PersonData = req.body;
    const username = req.user?.username as string;

    try {
      const person = await prisma.person.update({
        where: { id: personID },
        data: {
          ...personData,
          updatedBy: username,
        },
      });
      res.status(200).json(person);
    } catch (error) {
      res.status(404);
      next(`Cannot PUT /person/${personID}`);
    }
  }
);

// DELETE /person - delete a person that exist in db
router.delete("/:id(\\d+)", checkAuthorization, async (req, res, next) => {
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
router.post(
  "/:id(\\d+)/photo",
  checkAuthorization,
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

router.use("/photos", express.static("uploads"));

export default router;
