import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";

const app = express();

// GET /person - retrieve all persons
app.get("/person", async (req, res) => {
  const person = await prisma.person.findMany();
  res.json(person);
});

export default app;
