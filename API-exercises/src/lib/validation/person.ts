import { Static, Type } from "@sinclair/typebox";

export const personSchema = Type.Object(
  {
    name: Type.String(),
    surname: Type.String(),
    age: Type.Integer(),
  },
  { additionalProperties: false }
);

export type PersonData = Static<typeof personSchema>;
