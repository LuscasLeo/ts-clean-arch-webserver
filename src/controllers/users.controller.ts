import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { Express, NextFunction, Request, Response, Router } from "express";
import { HttpError } from "../types";
import { validateBody, validateNumberStrings, ValidationErrorSet } from "../validations";

const users = [
  {
    id: 1,
    age: 12,
    name: "lucas",
  },
  {
    id: 2,
    age: 21,
    name: "Leo",
  },
];

class UserPostRequest {
  @IsNumber()
  @Type(() => Number)
  public readonly age: number;

  @IsString()
  public readonly name: string;
}

const router = Router();

router.post("/", validateBody(UserPostRequest), (req: Request<{}, {}, UserPostRequest>, res) => {
  const { age, name } = req.body;

  const user = {
    id: users.length + 1,
    age,
    name,
  };

  users.push(user);

  res.json(user);
});

router.get("/:id", validateNumberStrings(["id"]), (req: Request<{ id: string }>, res) => {
  const { id } = req.params;
  const user = users.find((e) => e.id === Number(id));
  if (!user) throw new HttpError(404, "User not found!");

  res.json(user);
});

router.get("/", (req, res) => {
  res.json(users);
});


export const usersRouter = { path: "/users", router };
