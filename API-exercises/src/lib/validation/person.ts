import { Static, Type } from "@sinclair/typebox";
import { type } from "os";

export const personSchema = Type.Object(
  {
    name: Type.String(),
    surname: Type.String(),
    age: Type.Integer(),
  },
  { additionalProperties: false }
);

export type PersonData = Static<typeof personSchema>;
